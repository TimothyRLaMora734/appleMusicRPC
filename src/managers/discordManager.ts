import { Client, Presence } from "discord-rpc";

import Song from "@classes/Song";
import { iTunesProps } from "@interfaces/iTunes";
import { formatTime } from "@util/formatTime";

import { APP_ID, logger } from "../config";
import { initApp, vars } from "../index";

export let rpcClient: DiscordClient;

class DiscordClient {
	clientId: string;
	#client: Client;
	#ready = false;
	actualPresence!: Presence;

	constructor() {
		rpcClient = this;
		this.clientId = APP_ID;
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
					rpcClient = undefined!;
					clearInterval(vars.loopTimer);
					vars.loopTimer = setInterval(() => initApp(), 1000);
					this.loginClient();
				}, 1000);
			}
		);

		this.loginClient();
	}

	loginClient() {
		this.#client
			.login({ clientId: this.clientId })
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

export const setActivity = (presenceData: Presence, song: Song) => {
		if (!presenceData) return clearActivity();

		if (song.state === "playing") return;

		logger.extend("service").extend("discordManager").extend("setActivity")(
			`Now playing; ${song.artist} - ${song.title}. Duration: ${formatTime(
				song.duration as number
			)}`
		);

		if (!rpcClient) {
			rpcClient = new DiscordClient();
			rpcClient.actualPresence = presenceData;
		} else rpcClient.setActivity(presenceData);
	},
	clearActivity = () => {
		if (!rpcClient) return;
		rpcClient.clearActivity();
	},
	destroyClient = () => {
		if (!rpcClient) return;
		rpcClient.destroyClient();
	};
