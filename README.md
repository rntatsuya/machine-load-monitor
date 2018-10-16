# react-load-monitor

A simple web application created with React that monitors load average on your machine.

## Usage
Clone directory:
```
git clone https://github.com/rntatsuya/react-load-monitor.git
cd react-load-monitor
``` 

Running the app:
```
npm install
npm run start
``` 

Testing the alert logic:
```
npm run test
``` 

## Stack
- node.js
- react
- express
- socket.io
- babel
- webpack
- os-monitor
- os
- d3

## Assumptions
- CPU load is accurately measured by taking the load average of the past minute. This minute tick is the smallest unit of load used in this project.
- The CPU load threshold of interest is 1 for the 2 minute average. This value is hardcoded into the project as of now, it is not difficult to make it a variable value from user input.
- The amount of data stored on the server-side is small enough for it to be feasible to send to the client-side. For this project, I only need to store 60 objects because I only need to show a 10 minute history with updates every 10 seconds.
-  Whenever the load for the past 2 minutes exceeds 1 on average, an alert is triggered. When the load average drops again below 1 on average for the past 2 minutes, a recovery alert is triggered. 

## Parts to Improve
- Use Redux for state management rather than keeping a local copy of the state in React components. This change can be justified if we assume this project will be extended, but is rather unnecessary when the number of states to store is so few. 
- 
