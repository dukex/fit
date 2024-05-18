import Settings from "./settings";

export default interface Controller {
	settings(): Settings;
	save(settings: Partial<Settings>): void;
}
