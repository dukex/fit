import { Setting } from "obsidian";
import { withTranslation } from "src/locale";

import type Presenter from "./Presenter";

import TokenField from "./view/TokenField";
import OwnerData from "./view/OwnerData";

export const t = withTranslation("SettingsView");

export default class SettingsView {
	presenter: Presenter;
	container: HTMLElement;

	constructor(presenter: Presenter, container: HTMLElement) {
		this.container = container;
		this.presenter = presenter;
	}

	private createNewSetting(): Setting {
		return new Setting(this.container);
	}

	display() {
		this.createNewSetting().setHeading().setName(t("Authentication"));

		TokenField({
			setting: this.createNewSetting(),
			token: this.presenter.token,
			onTokenChange: this.presenter.onTokenChange,
			openCreateNewTokenPage: this.presenter.openCreateNewTokenPage,
		});

		OwnerData({
			setting: this.createNewSetting(),
			owner: this.presenter.owner,
			authenticate: this.presenter.authenticate(),
		});

		this.createNewSetting()
			.setHeading()
			.setName(t("Repository"))
			.setDesc(
				t("Refresh to retrieve the latest list of repos and branches."),
			)
			.addExtraButton((button) =>
				button
					.setTooltip(t("Refresh repos and branches list"))
					.setDisabled(this.presenter.owner === "")
					.setIcon("refresh-cw")
					.onClick(async () => {
						this.presenter.refreshGithubData();
					}),
			);

		// this.view()
		// 	.setDesc(
		// 		"Select 'Add a README file' if creating a new repo. Make sure you are logged in to github on your browser.",
		// 	)
		// 	.addExtraButton((button) =>
		// 		button
		// 			.setIcon("github")
		// 			.setTooltip("Create a new repository")
		// 			.onClick(() => {
		// 				window.open(`https://github.com/new`, "_blank");
		// 			}),
		// 	);
		this.createNewSetting()
			.setName(t("Repository name"))
			.setDesc(
				t(
					"Select a repo to sync your vault, refresh to see your latest repos. If some repos are missing, make sure your token are granted access to them.",
				),
			);
		// .addDropdown((dropdown) => {
		// dropdown.selectEl.addClass("repo-dropdown");
		// this.existingRepos.map((repo) =>
		// 	dropdown.addOption(repo, repo),
		// );
		// dropdown.setDisabled(this.existingRepos.length === 0);
		// dropdown.setValue(this.plugin.settings.repo);
		// dropdown.onChange(async (value) => {
		// 	const repoChanged = value !== this.plugin.settings.repo;
		// 	if (repoChanged) {
		// 		this.plugin.settings.repo = value;
		// 		await this.plugin.saveSettings();
		// 		await this.refreshFields("branch(1)");
		// 	}
		// });
		// });
	}
}
