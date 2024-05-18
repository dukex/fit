import { PluginSettingTab, Plugin } from "obsidian";

import type Controller from "src/Controller";
import type Settings from "src/settings";

import Presenter from "./Presenter";
import View from "./View";

interface LocalPlugin extends Plugin {
	settings: Settings;
	saveSettings(settings: Partial<Settings>): void;
}

export default class SettingsTabController
	extends PluginSettingTab
	implements Controller
{
	plugin: LocalPlugin;

	constructor(plugin: LocalPlugin) {
		super(plugin.app, plugin);
		this.plugin = plugin;
	}

	settings(): Settings {
		return this.plugin.settings;
	}

	save(data: Partial<Settings>) {
		console.log("save", data);

		this.plugin.saveSettings(data);
	}

	display() {
		console.log("display");
		this.containerEl.empty();

		const presenter = new Presenter(this);
		const view = new View(presenter, this.containerEl);

		view.display();
	}

	async getUser() {}
}
