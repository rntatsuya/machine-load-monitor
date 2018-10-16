const createAlert = require('./alert');

const LOAD_ALERT_THRESHOLD = 1;


// helper function to print out alert based on the input alert state
const printAlert = (alert) => {
  if (!alert) {
    console.log('No Alert!');
    return;
  }

  const tab = '    ';
  const headerMessage = alert.isAlert ? 'High load generated an alert' : 'Alert recovered';
  const detailsMessage = 'Load Avg. = ' + alert.loadAvg + ' at ' + (new Date(alert.timestamp).toLocaleTimeString());

  console.log(tab + headerMessage);
  console.log(tab + detailsMessage);
}

// helper func to compare caluclated alert and expected alert
const compareAlerts = (alertData, prevAlert, expectedAlert, LOAD_ALERT_THRESHOLD) => {
  alert = createAlert(alertData, prevAlert, LOAD_ALERT_THRESHOLD);

  console.log('############################');
  console.log('Expecting alert as:');
  printAlert(expectedAlert);

  console.log('Calculated alert as:');
  printAlert(alert);
  console.log('\n');
}

// executes all test cases
const runTests = () => {
  console.log('Case 1: High-load alert following no previous alert.');
  {
    alertData = [ {value: 1.5, timestamp: 1539613164083},
                  {value: 1.5, timestamp: 1539613169084},
                  {value: 1.0, timestamp: 1539613174086},
                  {value: 1.0, timestamp: 1539613179088},
                ];
    prevAlert = {loadAvg: 0.5, isAlert: false, timestamp: 1539613154083};
    expectedAlert = {loadAvg: 1.25, isAlert: true, timestamp: 1539613179088};

    compareAlerts(alertData, prevAlert, expectedAlert, LOAD_ALERT_THRESHOLD);
  }

  console.log('Case 2: High-load alert following a previous alert.');
  {
    alertData = [ {value: 1.5, timestamp: 1539613164083},
                  {value: 1.5, timestamp: 1539613169084},
                  {value: 1.0, timestamp: 1539613174086},
                  {value: 1.0, timestamp: 1539613179088},
                ];
    prevAlert = {loadAvg: 1.5, isAlert: true, timestamp: 1539613154083};
    expectedAlert = {loadAvg: 1.25, isAlert: true, timestamp: 1539613179088};

    compareAlerts(alertData, prevAlert, expectedAlert, LOAD_ALERT_THRESHOLD);
  }

  console.log('Case 3: Recovery alert following a previous alert.');
  {
    alertData = [ {value: 0.5, timestamp: 1539613164083},
                  {value: 0.5, timestamp: 1539613169084},
                  {value: 1.0, timestamp: 1539613174086},
                  {value: 1.0, timestamp: 1539613179088},
                ];
    prevAlert = {loadAvg: 1.5, isAlert: true, timestamp: 1539613154083};
    expectedAlert = {loadAvg: 0.75, isAlert: false, timestamp: 1539613179088};

    compareAlerts(alertData, prevAlert, expectedAlert, LOAD_ALERT_THRESHOLD);
  }

  console.log('Case 4: Load Average under threshold following no previous alert.');
  {
    alertData = [ {value: 0.5, timestamp: 1539613164083},
                  {value: 0.5, timestamp: 1539613169084},
                  {value: 1.0, timestamp: 1539613174086},
                  {value: 1.0, timestamp: 1539613179088},
                ];
    prevAlert = {loadAvg: 0.5, isAlert: false, timestamp: 1539613154083};
    expectedAlert = null;

    compareAlerts(alertData, prevAlert, expectedAlert, LOAD_ALERT_THRESHOLD);
  }
}

// execute tests
runTests();
