import type { NotificationConfig } from "~/schemas/notifications";

export const buildDiscordShoutrrrUrl = (config: Extract<NotificationConfig, { type: "discord" }>) => {
	const url = new URL(config.webhookUrl);
	const pathParts = url.pathname.split("/").filter(Boolean);

	if (pathParts.length < 4 || pathParts[0] !== "api" || pathParts[1] !== "webhooks") {
		throw new Error("Invalid Discord webhook URL format");
	}

	const [, , webhookId, webhookToken] = pathParts;

	const shoutrrrUrl = new URL("discord://placeholder");
	shoutrrrUrl.username = webhookToken;
	shoutrrrUrl.hostname = webhookId;

	shoutrrrUrl.searchParams.append("splitLines", "false");
	if (config.username) {
		shoutrrrUrl.searchParams.append("username", config.username);
	}
	if (config.avatarUrl) {
		shoutrrrUrl.searchParams.append("avatarurl", config.avatarUrl);
	}
	if (config.threadId) {
		shoutrrrUrl.searchParams.append("thread_id", config.threadId);
	}

	return shoutrrrUrl.toString().replace("/?", "?");
};
