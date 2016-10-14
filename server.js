var express = require('express');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var app = express();

MongoClient.connect("mongodb://localhost:27017/url_shortener", function(err, db) {
  if(err) { console.log("There was the following error connecting to the database", err); }
  
  app.get('/', function(request, response) {
    response.end('Home Page');
  });
  
  app.get('/:url_id', function(request, response) {
    var url_id = request.params.url_id;
    var url_collection = db.collection('urls');
    url_collection.findOne( { "url_id" : parseInt(url_id) }, function(err, data) {
      if(err) { console.log("There was an error finding that url", err); }
      response.redirect("http://" + data["url"]);
    });
  });
  
  app.get('/new/:url', function(request, response) {
    
    var url = request.params.url;
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var url_regex = new RegExp(expression);
    
    if(!url.match(url_regex)) { response.end('That is not a valid url'); }
    
    var counter_collection = db.collection('counter');
    counter_collection.update( { "id" : "counter" }, { $inc: { count: 1 } }, function(err, data) {
      if(err) { console.log("There was an error incrementing the count", err); }
    });
    
    counter_collection.findOne({ "id" : "counter" }, function(err, data) {
      if(err) { console.log("There was an error finding count", err); }
      var urls_collection = db.collection('urls');
      var url_data = { url: url, url_id: data["count"] }
      urls_collection.insert(url_data, function(err, doc) {
        if(err) { console.log("There was an error inserting into mongodb", err); }
        var return_data = { old_url: url, new_url: "localhost:8080/" + data["count"] }
        response.end(JSON.stringify(doc));
      });
    });
  });
});

app.listen(8080, function() {
  console.log("URL shortener app is listening on port 8080");
});
