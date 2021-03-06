import { logger } from "config";

import { getProps, getState, isOpen } from "@util/state";

export const getMusicProcess = async (
	musicState: "isOpen" | "getState" | "getProps"
) => {
	switch (musicState) {
		case "isOpen": {
			const open = await isOpen();
			logger.extend("debug").extend("getMusicProcess")("open %o", open);
			return open;
		}
		case "getState": {
			const state = await getState();
			logger.extend("debug").extend("getMusicProcess")("state %o", state);
			return state;
		}
		case "getProps": {
			const props = await getProps();
			logger.extend("debug").extend("getMusicProcess")("props %o", props);
			return props;
		}
	}
};
