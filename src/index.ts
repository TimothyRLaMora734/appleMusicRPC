import debug from "debug";
import { config } from "dotenv";
import { textSync } from "figlet";

import MusicManager from "@managers/musicManager";

import { logger } from "./config";

export class vars {
	public static loopTimer: NodeJS.Timer;
}

const showFiglet = async () => {
		console.log(textSync("Apple Music Discord RPC"));
	},
	start = async () => {
		if (process.env.DEBUG) debug.enable("appleMusicRPC*");
		else debug.enable("appleMusicRPC:service*");
		showFiglet();
		loadEnv();
		initApp();
	},
	loadEnv = async () => {
		config({ path: "./.env" });
	};

export const initApp = async () => {
	logger.extend("service").extend("rpcLoop")("Starting RPC loop");

	const am = new MusicManager();

	vars.loopTimer = setInterval(() => am.rpcLoop(), 1000);
};

start();
