var express = require('express')
var http = require("http");
var packageInfo = require('./package.json')

var app = express()

app.get('/', function (req, res) {
  res.json({ version: packageInfo.version })
})

setInterval(function() {
  http.get("http://manjarogroupbot.herokuapp.com")
  console.log("mandei mensagem")
}, 250000)


var server = app.listen(process.env.PORT|| 5000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Web server started at http://%s:%s', host, port)
})
