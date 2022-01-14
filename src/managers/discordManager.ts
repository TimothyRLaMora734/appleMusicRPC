import axios from "axios";
import { PresenceOptions } from "detritus-client-socket/lib/gateway";
import { Presence } from "discord-rpc";

import Song from "@classes/Song";
import { DiscordRPCManager, rpcVars } from "@managers/discord/rpcManager";
import { DiscordSocketManager, socketVars } from "@managers/discord/socketManager";
import { formatTime } from "@util/formatTime";

import { APP_ID, logger } from "../config";

export const setActivity = async (presenceData: Presence, song: Song) => {
		if (!presenceData) return clearActivity();

		if (song.state === "playing") return;

		logger.extend("service").extend("discordManager").extend("setActivity")(
			`Now playing; ${song.artist} - ${song.title}. Duration: ${formatTime(
				song.duration as number
			)}`
		);

		if (!process.env.discord_token) {
			if (!rpcVars.rpcClient) {
				rpcVars.rpcClient = new DiscordRPCManager();
				rpcVars.rpcClient.actualPresence = presenceData;
			} else rpcVars.rpcClient.setActivity(presenceData);
		} else {
			const res = await axios.post(
				`https://discord.com/api/v9/applications/${APP_ID}/external-assets`,
				{
					urls: [presenceData.largeImageKey]
				},
				{
					headers: {
						Authorization: process.env.discord_token
					}
				}
			);

			const presence: PresenceOptions = {
				activities: [
					{
						name: "Apple Music",
						type: 2,
						details: presenceData.details,
						state: presenceData.state,
						assets: {
							largeImage: `mp:${res.data[0].external_asset_path}`,
							largeText: presenceData.largeImageText
						},
						timestamps: {
							start: Date.now(),
							end: presenceData.endTimestamp as number
						}
					}
				]
			};

			if (!socketVars.socketClient) {
				socketVars.socketClient = new DiscordSocketManager();
				socketVars.socketClient.setActivity(presence);
			} else socketVars.socketClient.setActivity(presence);
		}
	},
	clearActivity = () => {
		if (!process.env.discord_token) {
			if (!rpcVars.rpcClient) return;
			rpcVars.rpcClient.clearActivity();
		} else {
			if (!socketVars.socketClient) return;
			socketVars.socketClient.clearActivity();
		}
	},
	destroyClient = () => {
		if (!process.env.discord_token) {
			if (!rpcVars.rpcClient) return;
			rpcVars.rpcClient.destroyClient();
		} else {
			if (!socketVars.socketClient) return;
			socketVars.socketClient.destroyClient();
		}
	};
