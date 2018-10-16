const createAlert = (alertData, prevAlert, LOAD_ALERT_THRESHOLD) => {
  let alert = null;

  // get load avg.
  const loadSum = alertData.reduce((sum, dataPoint) => sum + dataPoint.value, 0);
  const loadAvg = (loadSum / alertData.length).toFixed(4);

  // get last timestamp
  const timestamp = alertData[alertData.length - 1].timestamp;

  // make an alert if either the threshold is surpassed
  // or if loadAvg is below the threshold following a previous alert
  const isAlert = loadAvg > LOAD_ALERT_THRESHOLD;
  if (isAlert || (!isAlert && prevAlert && prevAlert.isAlert)) {
    alert = {loadAvg, isAlert, timestamp};
  }

  return alert;
};

module.exports = createAlert;
