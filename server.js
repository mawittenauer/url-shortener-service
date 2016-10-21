var url_api = require('./app/api/url_api.js');
var express = require('express');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var port = process.env.PORT || 8080;

var app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/assets'));

MongoClient.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/url_shortener", function(err, db) {
  if(err) { console.log("There was the following error connecting to the database", err); }
  
  app.get('/', function(request, response) {
    response.render('index');
  });
  
  url_api(app, db);
});

app.listen(port, function() {
  console.log("URL shortener app is listening on port 8080");
});
