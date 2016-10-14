var express = require('express');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var app = express();

app.get('/', function(request, response) {
  MongoClient.connect("mongodb://localhost:27017/url_shortener", function(err, db) {
    if(err) { console.log("There was the following error connecting to the database", err); }
    response.end('You are connected to the database.');
  });
});

app.listen(8080, function() {
  console.log("URL shortener app is listening on port 8080");
});
