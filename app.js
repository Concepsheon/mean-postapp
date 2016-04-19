var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var routes = require('./routes/index');
var mongoose = require("mongoose");

var config = require("./config");


var port = process.env.PORT || 3000;
var host = process.env.IP || 'localhost';

mongoose.connect(config.url, function(err,db){
    if(err){
        return console.log('failed to connect to mongodb', err);
    }
    console.log('connected to mongodb');
});

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));



app.use('/', routes);

app.listen(port, host, function(){
  console.log(`http://${host}:${port}/`);
});
