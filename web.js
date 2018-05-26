var http = require("http");
setInterval(function() {
    http.get("http://manjarogroupbot.herokuapp.com");
}, 300000);
