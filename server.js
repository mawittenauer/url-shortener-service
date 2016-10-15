var url_api = require('./app/api/url_api.js');
var express = require('express');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var app = express();

MongoClient.connect("mongodb://localhost:27017/url_shortener", function(err, db) {
  if(err) { console.log("There was the following error connecting to the database", err); }
  
  app.get('/', function(request, response) {
    response.end('Home Page');
  });
  
  url_api(app, db);
});

app.listen(8080, function() {
  console.log("URL shortener app is listening on port 8080");
});
