var express = require('express');
var request = require('request');
var app = express();

var parseString = require('xml2js').parseString;

app.get('/api/search', function (req, res) {
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

// app.get('/', function(req, res) {
// 	res.render("webspeechdemo.html");
// });

app.use(express.static(__dirname + '/'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});