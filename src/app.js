const express = require('express');
const redis = require('redis');

const os = require('os');
const app = express();
const PORT = 3000;

const createClient = redis.createClient;

const redisClient = createClient({
	url: process.env.REDIS_URL || 'redis://localhost:6379',
}).on('error', (error) => console.log(`Redis Client Error: ${error}`));

app.get('/', async (_req, res) => {
	const count = await redisClient.get('hitCount') ?? 0;
	res.send(`Hit Count: ${count}. Hostname: ${os.hostname()}`);
});

app.post('/hit', async (_req, res) => {
	const count = await redisClient.incr('hitCount');
	res.send(`Hit count updated to ${count}`);
});

app.post('/reset', async (_req, res) => {
	const count = await redisClient.set('hitCount', 0);
	res.send(`Count reset to 0`);
});

const main = async () => {
	await redisClient.connect();
	app.listen(PORT, () => {
		console.log(`Kubecounter listening on PORT ${PORT}`);
	});
};

main();
