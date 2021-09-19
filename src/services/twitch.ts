import { StaticAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';

import { TWITCH_CLIENT_ID, TWITCH_TOKEN } from '../constants/env';

const apiClient = new ApiClient({ authProvider: new StaticAuthProvider(TWITCH_CLIENT_ID, TWITCH_TOKEN) });

export async function isChannelLive(id: string) : Promise<boolean> {
	const user = await apiClient.users.getUserByName(id);
	return await user?.getStream() !== null;
}