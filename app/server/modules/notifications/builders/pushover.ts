import type { NotificationConfig } from "~/schemas/notifications";

export const buildPushoverShoutrrrUrl = (config: Extract<NotificationConfig, { type: "pushover" }>) => {
	const shoutrrrUrl = new URL("pushover://placeholder");
	shoutrrrUrl.username = "shoutrrr";
	shoutrrrUrl.password = config.apiToken;
	shoutrrrUrl.hostname = config.userKey;
	shoutrrrUrl.pathname = "/";

	if (config.devices) {
		shoutrrrUrl.searchParams.append("devices", config.devices);
	}

	if (config.priority !== undefined) {
		shoutrrrUrl.searchParams.append("priority", config.priority.toString());
	}

	return shoutrrrUrl.toString();
};
