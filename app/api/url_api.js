module.exports = function(app, db) {
  var bodyParser = require('body-parser');
  
  // create application/json parser 
  var jsonParser = bodyParser.json();
 
  // create application/x-www-form-urlencoded parser 
  var urlencodedParser = bodyParser.urlencoded({ extended: false });
  
  app.post('/new_url', urlencodedParser, function(request, response) {
    if(!request.body) return response.sendStatus(400);
    var url = request.body.url;
    var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
    var url_regex = new RegExp(expression);

    if(!url.match(url_regex)) {
      response.render('index', function(err, html) {
        if(err) console.log(err);
        html += "<script>alert('URL must be in http://www.example.com format')</script>";
        response.end(html);
      });
    } else {
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
          var return_data = { old_url: url, new_url: "https://mike-url.herokuapp.com/" + data["count"] }
          response.render('url', { url: return_data["new_url"] });
        });
      });
    }
  });
  
  app.get('/:url_id', function(request, response) {
    var url_id = request.params.url_id;
    var url_collection = db.collection('urls');
    url_collection.findOne( { "url_id" : parseInt(url_id) }, function(err, data) {
      if(err) { 
        console.log("There was an error finding that url", err); 
        response.end('That was an incorrect url.');
      }
      
      if(data != null) {
        response.redirect(data["url"]);
      } else {
        response.end('That is an incorrect url');
      }
    });
  });
}
  