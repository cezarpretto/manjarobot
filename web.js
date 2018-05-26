var http = require("http");

setInterval(function() {
  http.get("http://manjarogroupbot.herokuapp.com")
  console.log("mensagem enviada!")
}, 250000);

handle = (req, res) => res.end "hit"

server = http.createServer handle

server.listen process.env.PORT || 5000
