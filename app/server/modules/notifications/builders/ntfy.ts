import type { NotificationConfig } from "~/schemas/notifications";

export const buildNtfyShoutrrrUrl = (config: Extract<NotificationConfig, { type: "ntfy" }>) => {
	const { username, password, accessToken } = config;
	const shoutrrrUrl = new URL("ntfy://placeholder");

	if (username && password) {
		shoutrrrUrl.username = username;
		shoutrrrUrl.password = password;
	}

	if (accessToken) {
		shoutrrrUrl.username = "";
		shoutrrrUrl.password = accessToken;
	}

	if (config.serverUrl) {
		const url = new URL(config.serverUrl);
		const scheme = url.protocol === "https:" ? "https" : "http";

		shoutrrrUrl.hostname = url.hostname;
		shoutrrrUrl.port = url.port;
		shoutrrrUrl.pathname = `/${config.topic}`;
		shoutrrrUrl.searchParams.append("scheme", scheme);
	} else {
		shoutrrrUrl.hostname = "ntfy.sh";
		shoutrrrUrl.pathname = `/${config.topic}`;
	}

	if (config.priority) {
		shoutrrrUrl.searchParams.append("priority", config.priority);
	}

	return shoutrrrUrl.toString();
};
