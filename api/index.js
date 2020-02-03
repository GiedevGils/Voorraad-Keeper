const express = require('express');
const fs = require('fs');


const app = express();
app.use(express.json())

const dummy_data = require('./db/storage_dummy.json');
let official_data = require('./db/storage.json');

let lastModified = require('./db/lastmodified.json');

app.get('/',  (req, res) => {
	res.send('hello world')
});

app.get('/dummy', (req, res) => {
	res.send(dummy_data);
})

app.get('/data', (req, res) => {
	res.send({
		lastModified: lastModified,
		data: official_data
	});
})

app.post('/save', (req, res) => {
	let body = req.body;
	official_data = body;

	console.log( "REQ: ");
	console.log(req.body);

	fs.writeFile('./db/storage.json', JSON.stringify(official_data), 'utf8', () => {
		fs.writeFile('./db/lastmodified.json', JSON.stringify(Date.now()), 'utf8', () => {
			console.log("writefile finished. lastmodified changed")
		})
	})
})

app.listen(3000);