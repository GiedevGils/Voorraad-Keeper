const express = require('express');
const fs = require('fs');


const app = express();
app.use(express.json())

const dummy_data = require('./db/storage_dummy.json');

let official_data;
let lastModified;

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', (req, res) => {
	res.send('hello world')
});

app.get('/dummy', (req, res) => {
	res.send(dummy_data);
})

app.get('/data', (req, res) => {
	// Get data again, it might have changed in the meantime
	lastModified = JSON.parse(fs.readFileSync('./db/lastModified.json', 'utf-8'));
	official_data = JSON.parse(fs.readFileSync('./db/storage.json', 'utf-8'));

	if( isEmpty(official_data) ) {
		official_data = [];
	}

	res.status(200).send({
		lastModified: lastModified,
		data: official_data
	});
})

app.post('/save', (req, res) => {
	let body = req.body;
	official_data = body.categories;
	lastModified = body.lastModified;

	fs.writeFile('./db/storage.json', JSON.stringify(official_data), 'utf8', () => {

		fs.writeFile('./db/lastmodified.json', lastModified, 'utf8', () => {
			console.log(new Date().getTime() + " - writefile finished. lastmodified changed")
		});

	})

	res.status(200).send({msg: "Operation success"});
})

app.get('/*', (req, res) => {
	res.status(404).send( { msg: "This page is not known" } )
})

app.listen(3000, () => {
	console.log("app running on port 3000")
});

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}