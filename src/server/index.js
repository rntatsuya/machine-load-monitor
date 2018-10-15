const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const monitor = require("os-monitor");
const os = require("os");
const Queue = require("./queue");
const createAlert = require('./alert');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const dataLog = new Queue();
const alertData = []; // store
let prevAlert = null; // save the alerts to emit to client

const MAX_DELTA_TIME = monitor.minutes(10);
const LOAD_AVG_CHECK_INTERVAL = monitor.minutes(0.5);

const NUM_CPUS = os.cpus().length;
const PER_CPU_LOAD_THRESHOLD = 2;
const LOAD_ALERT_THRESHOLD = Math.ceil(NUM_CPUS / PER_CPU_LOAD_THRESHOLD);


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
  const dataPoint = {load: event.loadavg[0], freeMem: bytesToGigaBytes(event.freemem), timestamp: Date.now()};
  console.log('freeMem', dataPoint);

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
    const alert = createAlert(alertData, prevAlert, LOAD_ALERT_THRESHOLD);

    console.log(prevAlert);
    if (alert) {
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

const bytesToGigaBytes = (bytes) => {
  return bytes / Math.pow(10, 9);
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
  delay: monitor.seconds(5), // interval between monitor cycles
});

// start the server
const port = 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));


console.log(os.cpus());
