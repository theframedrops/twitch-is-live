import "dotenv/config";
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { PORT } from './constants/env';
import { isChannelLive } from './services/twitch';

const app = express();

app.use(helmet());
app.use(cors({
	origin: ['https://theframedrops.com']
}));

app.get('/channels/*', async (req, res) => {
	const channels = req.path.split("/").splice(2);
	const isLive: {[channel: string]: boolean} = {};

	await Promise.all(channels.map(async (channel) => {
		isLive[channel] = await isChannelLive(channel);
	}));

	res.json(isLive);
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}.`);
});
