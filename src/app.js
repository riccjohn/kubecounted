const express = require('express');
const redis = require('redis');

const app = express();
const PORT = 3000;

let count = 0;
app.get('/', (_req, res) => {
	res.send(`Hit Count: ${count}`);
});

app.post('/hit', (_req, res) => {
	count++;
	res.send(`Hit count updated to ${count}`);
});

app.post('/reset', (_req, res) => {
	count = 0;
	res.send(`Count reset to 0`);
});

app.listen(PORT, () => {
	console.log(`Kubecounter listening on PORT ${PORT}`);
});
