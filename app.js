var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var routes = require('./routes/routes');

mongoose.connect('mongodb://localhost/chordDB');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())

routes(app);


app.listen(2000);