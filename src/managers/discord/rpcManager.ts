import { Client, Presence } from "discord-rpc";

import { APP_ID, logger } from "../../config";
import { initApp, vars } from "../../index";

export class rpcVars {
	public static rpcClient: DiscordRPCManager;
}

export class DiscordRPCManager {
	#clientId: string;
	#client: Client;
	#ready = false;
	actualPresence!: Presence;

	constructor() {
		rpcVars.rpcClient = this;
		this.#clientId = APP_ID;
		this.#client = new Client({
			transport: "ipc"
		});

		this.#client.on("ready", () => {
			this.#ready = true;
			this.setActivity();
			logger.extend("service").extend("discordManager").extend("client")(
				`Logged in as ${this.#client.user.username}#${
					this.#client.user.discriminator
				}`
			);
		});

		this.#client.on(
			// @ts-expect-error: This type doesn't exist.
			"disconnected",
			(err: any) => {
				console.log(err);
				setTimeout(() => {
					this.destroyClient();
					rpcVars.rpcClient = undefined!;
					clearInterval(vars.loopTimer);
					vars.loopTimer = setInterval(() => initApp(), 1000);
				}, 1000);
			}
		);

		this.loginClient();
	}

	loginClient() {
		this.#client
			.login({ clientId: this.#clientId })
			.catch(err => console.error(err));
	}

	setActivity(data?: Presence) {
		data = data ? data : this.actualPresence;
		if (!this.#ready) return;

		this.#client.setActivity(data);
	}

	clearActivity() {
		if (!this.#ready) return;

		this.#client.clearActivity();
	}

	destroyClient() {
		if (!this.#ready) return;

		this.#client.destroy();
	}
}
