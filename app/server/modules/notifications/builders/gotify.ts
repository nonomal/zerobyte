import type { NotificationConfig } from "~/schemas/notifications";

export const buildGotifyShoutrrrUrl = (config: Extract<NotificationConfig, { type: "gotify" }>) => {
	const url = new URL(config.serverUrl);
	const path = config.path ? `/${config.path.replace(/^\/+|\/+$/g, "")}` : "";
	const disableTLS = url.protocol === "http:";

	const shoutrrrUrl = new URL("gotify://placeholder");
	shoutrrrUrl.hostname = url.hostname;
	shoutrrrUrl.port = url.port;
	shoutrrrUrl.pathname = `${path}/${config.token}`;

	if (disableTLS) {
		shoutrrrUrl.searchParams.set("DisableTLS", "true");
	}

	if (config.priority !== undefined) {
		shoutrrrUrl.searchParams.set("priority", String(config.priority));
	}

	return shoutrrrUrl.toString();
};
