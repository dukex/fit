import { Setting } from "obsidian";
import { withTranslation } from "src/locale";

const t = withTranslation("TokenField");

export default function TokenField({
	setting,
	token,
	onTokenChange,
	openCreateNewTokenPage,
}: {
	setting: Setting;
	token: string;
	onTokenChange(token: string): void;
	openCreateNewTokenPage(): void;
}) {
	setting
		.setName(t("Github personal access token"))
		.setDesc(
			t(
				"Remember to give it access for reading and writing to the storage repo.",
			),
		)
		.addText((text) =>
			text
				.setPlaceholder(t("GitHub personal access token"))
				.setValue(token)
				.onChange((value) => onTokenChange(value)),
		)
		.addExtraButton((button) =>
			button
				.setIcon("external-link")
				.setTooltip(t("Create a token"))
				.onClick(async () => openCreateNewTokenPage()),
		);
}
