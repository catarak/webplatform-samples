var express = require('express');
var request = require('request');
var app = express();
var mongoose = require('mongoose');

var parseString = require('xml2js').parseString;

mongoose.connect('mongodb://localhost/mansplain');

var Query = mongoose.model('Query', {text: String});


app.get('/api/search', function (req, res) {
  var query = new Query({text: req.query.text});
  query.save(function(err, queryObj) {
    if (err) {
      console.log(err);
    } else {
      console.log('saved successfully:', queryObj);
    }
  });
  
  request({
  	method: 'GET', 
  	url: "http://api.wolframalpha.com/v2/query",
  	qs: {
  		appid: "UQXVQT-8W6A4T78KK",
  		input: req.query.text
  	}
  },
  function(err, response) {
		var body = response.body;
		parseString(body, function(err, result) {
			if(result.queryresult.$.success == "true"){
				res.json({definition: result.queryresult.pod[1].subpod[0].plaintext});
			}
			else {
				res.json({definition: ""});
			}
		});
  });
});

app.use(express.static(__dirname + '/'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});