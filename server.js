var express = require('express'),
    fs = require('fs'),
    app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  fs.readFile('./index.html', 'utf8', function(err, data) {
    res.send(data);
  });
});

app.listen(5000);
