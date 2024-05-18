import type Controller from "./Controller";

export default class SettingsPresenter {
	controller: Controller;
	loading: boolean;

	constructor(controller: Controller) {
		this.controller = controller;

		const { token, owner } = controller.settings();

		this.token = token;
		this.owner = owner;
		this.loading = false;
	}

	// TOKEN
	token: string;
	onTokenChange(value: string) {
		console.log("onTokenChange", value);

		this.token = value;
		this.controller.save({ token: value });
	}

	openCreateNewTokenPage() {
		window.open("https://github.com/settings/tokens/new", "_blank");
	}

	// OWNER
	owner: string;

	// ACTIONS

	async authenticate() {
		this.loading = true;
		await this.controller.getUser();
		this.loading = false;
	}

	refreshGithubData() {
		throw new Error("Method not implemented.");
	}
}
