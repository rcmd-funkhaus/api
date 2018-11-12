var http = require('http');
var url = require('url');
var oldUmask = process.umask(0000);

//routes
var index = require('./routes/index.js');
var telegram = require('./routes/telegram.js');
var routes = {
  '/': index,
  '/telegram': telegram
};

//server
var server = http.createServer(function(request, response) {
  var parts = url.parse(request.url);
  var route = routes[parts.pathname];
  
  if (route) {
    route(request, response);
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});

server.listen('/var/run/apps/apps-api.sock', function() {
  process.umask(oldUmask);
  console.log(process.env['SOCKET_PATH']);
  console.log('Server bound');
});
