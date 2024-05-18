import { Setting } from "obsidian";
import { withTranslation } from "src/locale";

const t = withTranslation("OwnerData");

export default function OwnerData({
	setting,
	owner,
	authenticate,
}: {
	setting: Setting;
	owner: string;
	authenticate: () => void;
}) {
	const ownerSetting = setting
		.setDesc(
			t(
				"Input your personal access token below to get authenticated. Create a GitHub account here if you don't have one yet.",
			),
		)
		.addButton((button) =>
			button
				.setCta()
				.setButtonText(t("Authenticate"))
				.setDisabled(owner !== "")
				.setTooltip(t("Authenticate using the token"))
				.onClick(async () => authenticate()),
		);

	ownerSetting.nameEl.addClass("fit-avatar-container");

	// TODO: refactor
	if (owner === "") {
		ownerSetting.nameEl.createDiv({
			cls: "fit-avatar-container empty",
		});
		const authUserHandle = ownerSetting.nameEl.createEl("span", {
			cls: "fit-github-handle",
		});
		authUserHandle.setText("Unauthenticated");
	} else {
		const authUserAvatar = ownerSetting.nameEl.createDiv({
			cls: "fit-avatar-container",
		});

		authUserAvatar.createEl("img", {
			attr: { src: "this.plugin.settings.avatarUrl" },
		});
		// 	this.authUserHandle = this.ownerSetting.nameEl.createEl("span", {
		// 		cls: "fit-github-handle",
		// 	});
		// 	this.authUserHandle.setText(this.plugin.settings.owner);
	}

	ownerSetting.controlEl.addClass("fit-avatar-display-text");
}
