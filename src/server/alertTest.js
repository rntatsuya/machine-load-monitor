const createAlert = require('./alert');

const LOAD_ALERT_THRESHOLD = 1;


console.log('Case with alert after no previous alert.');
{
  alertData = [ {value: 0.5, timestamp: 1539613164083},
                {value: 0.5, timestamp: 1539613169084},
                {value: 1.0, timestamp: 1539613174086},
                {value: 1.0, timestamp: 1539613179088},
              ];
  prevAlert = {loadAvg: 0.5, isAlert: false, timestamp: 1539613154083};

  alert = createAlert(alertData, prevAlert, LOAD_ALERT_THRESHOLD);

  console.log(alert);
  printAlert(alert);
}


console.log('Case with alert after previous alert.');
{
  alertData = [ {value: 1.5, timestamp: 1539613164083},
                {value: 1.5, timestamp: 1539613169084},
                {value: 1.0, timestamp: 1539613174086},
                {value: 1.0, timestamp: 1539613179088},
              ];
  prevAlert = {loadAvg: 1.5, isAlert: true, timestamp: 1539613154083};

  alert = createAlert(alertData, prevAlert, LOAD_ALERT_THRESHOLD);

  printAlert(alert);
}

console.log('Case with recovery after alert.');
{
  alertData = [ {value: 0.5, timestamp: 1539613164083},
                {value: 0.5, timestamp: 1539613169084},
                {value: 1.0, timestamp: 1539613174086},
                {value: 1.0, timestamp: 1539613179088},
              ];
  prevAlert = {loadAvg: 1.5, isAlert: true, timestamp: 1539613154083};

  alert = createAlert(alertData, prevAlert, LOAD_ALERT_THRESHOLD);

  printAlert(alert);
}


// helper function to print out alert based on the input alert state
const printAlert = (alert) => {
  if (!alert) {
    console.log('No Alert!');
    return;
  }

  const headerMessage = alert.isAlert ? 'High load generated an alert' : 'Alert recovered';
  const detailsMessage = 'Load Avg. = ' + alert.loadAvg + ' at ' + (new Date(alert.timestamp).toLocaleTimeString());

  console.log(headerMessage);
  console.log(detailsMessage);
}
