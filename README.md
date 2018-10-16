# Machine Load Monitor

A simple web application that monitors load average and memory usage on your machine in real-time.

Since this application was created with the React framework, it is highly extendable in terms of adding new components and features. 

## Sample Image 


## Usage
### Clone directory:
```
git clone https://github.com/rntatsuya/react-load-monitor.git
cd react-load-monitor
``` 

### Running the app:
```
npm install
npm run start
``` 
Then open http://localhost:3000/.

### Testing the alert logic:
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
- CPU load is accurately measured by taking the load average of the past minute. This minute tick is the base unit of load used in this project.
- The CPU load threshold of interest is 1 for the 2 minute average. This value is hardcoded into the project as of now, but it is not difficult to make it a variable value determined by user input.
- The historical data stored on the server-side is small enough for it to be feasible to send the entire array to the client-side and update interface in real-time. For this project, I only needed to store 60 objects because the app shows a 10 minute history with updates every 10 seconds. However, if the number of these objects were to increase exponentially, it may be more reasonable to cache the historical data array on the client-side and move the array update logic to the client-side instead in order to prevent sending the entire array over from the server to the clients-side every 10 seconds.  
- Whenever the load for the past 2 minutes exceeds 1 on average, a high-load alert is triggered. 
- When the load average drops below 1 on average for the past 2 minutes following a high-load alert, a recovery alert is triggered. 

## Parts to Improve
- Use Redux for state management rather than keeping a local copy of the state in React components. This change can be justified if we assume this project will be extended, but is rather unnecessary when the number of states to store is so few. 
- In exchange for code complexity on the client-side, I can prevent data duplication of timestamps between the memory array and the load array which is updated every 10 seconds. 
- 
