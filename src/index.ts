import "dotenv/config";
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { PORT } from './constants/env';
import { ChannelInfo, getChannelInfo } from './services/twitch';

const app = express();

app.use(helmet());
app.use(cors({
	origin: ['https://theframedrops.com', /^http\:\/\/127\.0\.0\.1\:/]
}));

function resolveTimeout<T>(promise: Promise<T>, timeout: number, otherwise: T) : Promise<T> {
	return new Promise((resolve) => {
		setTimeout(() => resolve(otherwise), timeout);
		promise.then(resolve);
	});
}

let cache: Record<string, ChannelInfo> = {};

app.get('/channels/*', async (req, res) => {
	if (req.headers.origin !== 'https://theframedrops.com' && !req.headers.origin?.startsWith('http://127.0.0.1:')) {
		res.status(500).send();
		return;
	}

	const channels = req.path.split("/").splice(2);
	const ret: {[channel: string]: ChannelInfo} = {};

	await Promise.all(channels.map(async (channel) => {
		const info = await resolveTimeout(
			getChannelInfo(channel),
			1000,
			cache[channel]
		);


		if (info) {
			cache[channel] = info;
			ret[channel] = info;
		}
	}));

	res.json(ret);
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}.`);
});
