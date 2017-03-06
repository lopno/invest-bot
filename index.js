const express = require('express');
const favicon = require('serve-favicon');
const app = express();


app.get('/', (req, res) => res.send('Hello World'));

app.use(favicon(__dirname + '/public/favicon.ico'));

app.listen(process.env.PORT || 3000);
