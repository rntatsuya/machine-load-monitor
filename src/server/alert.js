const createAlert = (alertData, prevAlert, LOAD_ALERT_THRESHOLD) => {
  let alert = null;

  // get load avg.
  const loadSum = alertData.reduce((sum, dataPoint) => sum + dataPoint.value, 0);
  const loadAvg = (loadSum / alertData.length).toFixed(4);

  console.log(loadSum);
  console.log(loadAvg);

  // get last timestamp
  const timestamp = alertData[alertData.length - 1].timestamp;
  const isAlert = loadAvg > LOAD_ALERT_THRESHOLD;

  if (isAlert || (!isAlert && prevAlert && prevAlert.isAlert)) {
    alert = {loadAvg, isAlert, timestamp};
  }

  return alert;
};

module.exports = createAlert;
