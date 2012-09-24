////////////////////////////////////////////////////////////////////////////////////////////
//
// Node server app for order API
//
//////////////////////////////////////////////////////////////////////////////////////////// 
//
load('helper.js');
load('metrics.js');
load('hardware.js');

var plexobject = plexobject || {};

plexobject.PORT = 8124;
plexobject.OUTLIER_SIZE = 2;
plexobject.socketsByAddr = {};
plexobject.totalClients = 0;

vertx.createHttpServer().websocketHandler(function(ws) {
   plexobject.totalClients++;
   ws.dataHandler(function(request) { 
      var response = {request: request.counter, timestamp : request.timestamp, address:request.address};
      metrics.update(request.address, request.request, request.timestamp, JSON.stringify(request).length);
      request.response.send(response);
   });
}).requestHandler(function(req) {
   //if (req.uri == "/") req.response.sendFile("websockets/ws.html")
}).listen(PORT)


      socket.on('disconnect', function() { 
         totalClients--;
         delete socketsByAddr[socket.address];


setInterval(function() {
   hardware.stop(function(usage) {
     console.log('sockets, clients, ' + hardware.heading() + ',' + metrics.heading());
     console.log(helper.size(socketsByAddr) + ',' + totalClients + ',' + usage.toString() + ',' + metrics.summary().toString());
   });
}, 15000);


