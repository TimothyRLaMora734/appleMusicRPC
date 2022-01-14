import { Gateway } from "detritus-client-socket";

import { logger } from "../../config";
import { initApp, vars } from "../../index";

export class socketVars {
	public static socketClient: DiscordSocketManager;
}

export class DiscordSocketManager {
	#socket: Gateway.Socket;
	#ready = false;

	constructor() {
		socketVars.socketClient = this;
		this.#socket = new Gateway.Socket(process.env.discord_token as string, {});

		this.#socket.on("ready", () => {
			this.#ready = true;
			logger.extend("service").extend("discordManager").extend("socket")(
				"Connected to Discord gateway"
			);
		});

		this.#socket.on("packet", packet =>
			logger.extend("debug").extend("discordManager").extend("socket")(
				"packet %o",
				packet
			)
		);

		this.#socket.on("close", err => {
			console.log(err);
			setTimeout(() => {
				this.destroyClient();
				socketVars.socketClient = undefined!;
				clearInterval(vars.loopTimer);
				vars.loopTimer = setInterval(() => initApp(), 1000);
			}, 1000);
		});

		this.loginClient();
	}

	loginClient() {
		this.#socket.connect("wss://gateway.discord.gg/");
	}

	setActivity(data?: any) {
		if (!this.#ready) return;

		this.#socket.setPresence(data);
	}

	clearActivity() {
		if (!this.#ready) return;

		this.#socket.setPresence(undefined);
	}

	destroyClient() {
		if (!this.#ready) return;

		this.#socket.kill();
	}
}
