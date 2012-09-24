////////////////////////////////////////////////////////////////////////////////////////////
//
// Client implementation for order API
//
////////////////////////////////////////////////////////////////////////////////////////////
// 
load('helper.js');
//load('metrics.js');
//load('hardware.js');


var plexobject = plexobject || {};

plexobject.OrderClient.MAX_ROWS = 10;
plexobject.OrderClient.PORT = 8124;
plexobject.INTERVAL_BETWEEN_NEW_CLIENTS = 15000;
plexobject.OrderClient.nextClientId = 0;
plexobject.OrderClient.nextRequestId = 0;
plexobject.OrderClient.totalConnected = 0;

plexobject.OrderClient = function() {
   this.id = ++plexobject.OrderClient.nextClientId;
   this.client = vertx.createHttpClient().setPort(PORT);
};

plexobject.OrderClient.prototype.connect = function() {
   var that = this;
   this.client.connectWebsocket('/order', function(websocket) {
      that.socket = websocket;
      websocket.dataHandler(function(address) {
         //var metric = plexobject.metrics.update(response.address, response.request, response.timestamp, JSON.stringify(response).length);
      });
   });
};

plexobject.OrderClient.prototype.close = function() {
   this.client.close();
};

plexobject.OrderClient.prototype.sendRequest = function(max) {
   var execs = [];
   var date = new Date();
   for (var i=0; i<max; i++) {
      execs.push({sequence:i, activityDateStr:date.toString(), com: helper.random(5),price: helper.random(100), accountId:1772139, symbol:"QQQ", transaction:"STO", description:"QQQ Stock", qty: helper.random(200), key: "QQQ:::S", netAmount: helper.random(1000)});
   }
   var request = {request: ++nextRequestId, rows:max, timestamp : date.getTime(), address:this.id, execs: execs};
   this.socket.writeTextFrame(request);
};

plexobject.OrderClient.prototype.log = function() {
   hardware.stop(function(usage) {
      //console.log('clients, connected,' + hardware.heading() + ',' + metrics.heading());
      //console.log(nextClientId + ',' + totalConnected + ',' + usage.toString() + ',' + metrics.summary().toString());
      console.log('clients, connected');
      console.log(nextClientId + ',' + totalConnected);
   });
};



// create connections for this client
var buildClients = function() {
   for (var i=0; i<100; i++) {
      var client = new plexobject.OrderClient();
      client.connect();
      setInterval(client.sendRequest(helper.random(MAX_ROWS)), helper.random(250) + 50);
   }
};


setInterval(buildClients, plexobject.INTERVAL_BETWEEN_NEW_CLIENTS);

setInterval(function() {
    plexobject.OrderClient.log();
}, plexobject.INTERVAL_BETWEEN_NEW_CLIENTS_SECS);

