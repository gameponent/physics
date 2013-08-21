var path = require('path');
var express = require('express');
var app = express();

app.set('views', __dirname);
app.set('view engine', 'jade');
app.use('/build', express.static(path.join(__dirname, 'build')));
app.get('/', function (req, res) {
  res.render('index', {'version': Date.now()});
});

app.listen(8888);
