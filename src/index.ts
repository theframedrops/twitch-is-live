import "dotenv/config";
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { PORT } from './constants/env';
import { ChannelInfo, getChannelInfo } from './services/twitch';

const app = express();

app.use(helmet());
app.use(cors({
	origin: ['https://theframedrops.com']
}));

app.get('/channels/*', async (req, res) => {
	if (req.headers.origin != 'https://theframedrops.com') {
		res.status(500).send();
		return;
	}

	const channels = req.path.split("/").splice(2);
	const ret: {[channel: string]: ChannelInfo} = {};

	await Promise.all(channels.map(async (channel) => {
		const info = await getChannelInfo(channel);
		if (info) ret[channel] = info;
	}));

	res.json(ret);
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}.`);
});
