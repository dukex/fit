import { moment } from "obsidian";

const en: { [c: string]: Record<string, string> } = {
	SettingView: {},
};

const localeMap: { [k: string]: Partial<typeof en> } = {
	en,
};

const locale = localeMap[moment.locale()];

export function withTranslation(context: string) {
	const contextualLocale = locale[context];

	return (text: string): string => {
		const translation = contextualLocale && contextualLocale[text];
		if (!translation || translation == "") {
			if (moment.locale() !== "en") {
				throw Error(
					`no translation to '${text}' at context '${context}' in '${locale}'`,
				);
			}
			return text;
		}

		return translation;
	};
}
