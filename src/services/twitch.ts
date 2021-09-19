import { StaticAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';

import { TWITCH_CLIENT_ID, TWITCH_TOKEN } from '../constants/env';

const apiClient = new ApiClient({ authProvider: new StaticAuthProvider(TWITCH_CLIENT_ID, TWITCH_TOKEN) });

export type ChannelInfo = {
	displayName: string,
	profilePictureUrl: string,
	isLive: boolean
};

export async function getChannelInfo(id: string) : Promise<ChannelInfo|null> {
	const user = await apiClient.users.getUserByName(id);
	if (!user) return null;

	return {
		displayName: user.displayName,
		profilePictureUrl: user.profilePictureUrl,
		isLive: await user.getStream() !== null
	}
}
