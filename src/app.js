const express = require('express');
const redis = require('redis');

const app = express();
const PORT = 3000;

const createClient = redis.createClient;

const redisClient = createClient().on('error', (error) =>
	console.log(`Redis Client Error: ${error}`),
);

app.get('/', async (_req, res) => {
	const count = await redisClient.get('hitCount');
	res.send(`Hit Count: ${count}`);
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
	await redisClient.set('hitCount', 0);
	app.listen(PORT, () => {
		console.log(`Kubecounter listening on PORT ${PORT}`);
	});
};

main();
