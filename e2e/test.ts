import fs from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { type Browser, expect, test as base } from "@playwright/test";
import { trackBrowserErrors } from "./helpers/browser-errors";
import { gotoAndWaitForAppReady } from "./helpers/page";

const workerAuthDir = path.join(process.cwd(), "playwright", ".auth", "workers");

type WorkerFixtures = {
	workerStorageState: string | undefined;
};

const createWorkerStorageState = async (browser: Browser, parallelIndex: number) => {
	const workerId = `worker-${parallelIndex}-${randomUUID().slice(0, 8)}`;
	const username = `e2e-${workerId}`;
	const email = `${username}@example.com`;
	const password = "password123";

	const workerStorageStatePath = path.join(workerAuthDir, `worker-${parallelIndex}.json`);
	const recoveryKeyPath = path.join(process.cwd(), "playwright", `restic-${workerId}.pass`);
	const baseURL = `http://${process.env.SERVER_IP}:4096`;

	fs.mkdirSync(workerAuthDir, { recursive: true });

	const context = await browser.newContext({ baseURL });
	try {
		const page = await context.newPage();

		await gotoAndWaitForAppReady(page, "/onboarding");

		await page.getByRole("textbox", { name: "Email" }).fill(email);
		await page.getByRole("textbox", { name: "Username" }).fill(username);
		await page.getByRole("textbox", { name: "Password", exact: true }).fill(password);
		await page.getByRole("textbox", { name: "Confirm Password" }).fill(password);
		await page.getByRole("button", { name: "Create admin user" }).click();
		await expect(page.getByText("Download Your Recovery Key")).toBeVisible();

		await page.getByRole("textbox", { name: "Confirm Your Password" }).fill(password);
		const downloadPromise = page.waitForEvent("download");
		await page.getByRole("button", { name: "Download Recovery Key" }).click();
		const download = await downloadPromise;
		await download.saveAs(recoveryKeyPath);
		await expect(page).toHaveURL("/volumes");

		await context.storageState({ path: workerStorageStatePath });
		return workerStorageStatePath;
	} finally {
		await context.close();
	}
};

export const test = base.extend<{}, WorkerFixtures>({
	workerStorageState: [
		async ({ browser }, use, workerInfo) => {
			if (workerInfo.project.name === "setup") {
				await use(undefined);
				return;
			}

			const storageStatePath = await createWorkerStorageState(browser, workerInfo.parallelIndex);
			await use(storageStatePath);
		},
		{ scope: "worker" },
	],
	storageState: async ({ workerStorageState }, use) => {
		await use(workerStorageState);
	},
	context: async ({ context }, use, testInfo) => {
		const browserErrorTracker = trackBrowserErrors(context, {
			attach: async (name, body, contentType) => {
				await testInfo.attach(name, { body, contentType });
			},
		});

		await use(context);

		await browserErrorTracker.assertNoBrowserErrors();
	},
});

export { expect };
