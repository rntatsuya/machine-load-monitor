const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const monitor = require("os-monitor");
const Queue = require("./queue");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const dataLog = new Queue();
const alertData = []; // store
let prevAlert = null; // save the alerts to emit to client

const MAX_DELTA_TIME = monitor.minutes(10);
const LOAD_AVG_CHECK_INTERVAL = monitor.minutes(1);
const LOAD_THRESHOLD = 2;

// connect to '/public/index.html' as root page
app.use('/', express.static('public'));

// setup socket
io.on("connection", socket => {
  console.log("New client connected"), setInterval(
    () => getLoad(socket),
    10000
  );
  socket.on("disconnect", () => console.log("Client disconnected"));
});

//
monitor.on('monitor', function(event) {
  console.log(event.type, ' This event always happens on each monitor cycle!');
  const dataPoint = {load: event.loadavg[0], timestamp: Date.now()};


  // keep only 10 min worth of data
  dataLog.enqueue(dataPoint); // store object with {load: --, timestamp: --}
  if (checkFull(dataLog.toArray(), MAX_DELTA_TIME)) {
    dataLog.dequeue();
  }

  // emit alert if 2 min avg goes above threshold
  alertData.push(dataPoint);
  console.log("alertData");
  console.log(alertData);
  if (checkFull(alertData, LOAD_AVG_CHECK_INTERVAL)) {
    // get load avg.
    const loadSum = alertData.reduce((sum, dataPoint) => sum + dataPoint.load, 0);
    const loadAvg = loadSum / alertData.length;

    // get last timestamp
    const timestamp = alertData[alertData.length - 1].timestamp;
    const isAlert = loadAvg > LOAD_THRESHOLD;

    console.log(prevAlert);
    if (isAlert || (!isAlert && prevAlert && prevAlert.isAlert)) {
      alert = {loadAvg, isAlert, timestamp};

      console.log("emitting alert");
      console.log(alert);
      io.emit('alert', alert);
      prevAlert = alert;
    }

    alertData.length = 0;
  }

  console.log(dataLog.toArray());
  io.emit('monitor', dataLog.toArray());
});

// check if dataLog queue is full for a given interval
const checkFull = (log, timeInterval) => {
  const oldest = log[0].timestamp;
  const newest = log[log.length - 1].timestamp;

  return newest - oldest >= timeInterval;
}


const isAlertNotNull = alert => {
  // if neither fields are null, alert is not null
  if (alert.load && alert.timestamp) {
    return true;
  }

  return false;
}

// event handler
const getLoad = async socket => {
  try {
    console.log("emitting");
    socket.emit("GetLoad", );
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

// start the os-monitor
monitor.start({
  delay: monitor.seconds(10), // interval between monitor cycles
});

// start the server
const port = 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
