////////////////////////////////////////////////////////////////////////////////////////////
//
// Test client for execution report that creates multiple threads and multiple connections 
// within each thread to hit the server and measure response time.
//
////////////////////////////////////////////////////////////////////////////////////////////
//
// Configuring test from environment variables
//
load('helper.js');

var plexobject = plexobject || {};

plexobject.OUTLIER_SIZE = 2;
plexobject.INTERVAL_BETWEEN_NEW_CLIENTS = 15000;

// create connections for this client
var buildClients = function() {
   for (var i=0; i<100; i++) {
      var client = new plexobject.OrderClient();
      client.connect();
      setInterval(client.sendRequest(helper.random(MAX_ROWS)), helper.random(250) + 50);
   }
};


setInterval(buildClients, INTERVAL_BETWEEN_NEW_CLIENTS);

setInterval(function() {
    plexobject.OrderClient.log();
}, INTERVAL_BETWEEN_NEW_CLIENTS_SECS);

