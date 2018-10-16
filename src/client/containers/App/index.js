import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import ScrollArea from 'react-scrollbar';

import LineChart from "../LineChart";
import Alert from "../../components/Alert";
import classes from './main.css';

const DEFAULT_MAX_LOAD = 4;
const DEFAULT_MAX_MEM = 100;
const DEFAULT_MIN_MEM = 0;
const ALERT_THRESHOLD = 1;
const DEFAULT_ENDPOINT = "http://localhost:3000";

class App extends Component {
  constructor() {
    super();

    // initialize local state
    this.state = {
      loadData: [],
      memData: [],
      alerts: [],
      loadYMax: DEFAULT_MAX_LOAD,
      memYMax: DEFAULT_MAX_MEM,
      memYMin: DEFAULT_MIN_MEM,
      alertThreshold: ALERT_THRESHOLD,
      endpoint: DEFAULT_ENDPOINT
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);

    // listen to receive data from server and update state accordingly
    socket.on('load-monitor', data => {
      this.setState({ loadData: data });
      this.adjustLoadYMax();
    });
    socket.on('mem-monitor', data => {
      this.setState({ memData: data });
      this.adjustMemYMaxMin();
    });
    socket.on('alert', alert => {
      this.setState({ alerts: [alert, ...this.state.alerts] });
    });
  }

  // helper func to dynamically adjust the y-axis values for the load chart
  adjustLoadYMax = () => {
    const maxLoad = this.state.loadData.reduce((prev, cur) => (prev.value > cur.value) ? prev : cur).value;

    if (maxLoad <= DEFAULT_MAX_LOAD) {
      this.setState({loadYMax: DEFAULT_MAX_LOAD});
    }
    else {
      // adjust upper bound by adding 1 to the max load in past 10 min
      this.setState({loadYMax: Math.trunc(maxLoad + 1)});
    }
  }

  // helper func to dynamically adjust the y-axis values for the memory chart
  adjustMemYMaxMin = () => {
    const maxMem = this.state.memData.reduce((prev, cur) => (prev.value > cur.value) ? prev : cur).value;
    const minMem = this.state.memData.reduce((prev, cur) => (prev.value < cur.value) ? prev : cur).value;

    // determine range by rounding max/min to nearest 10 and plus/minus 10
    this.setState({memYMax: (maxMem + 10 > DEFAULT_MAX_MEM ? DEFAULT_MAX_MEM : Math.round(maxMem / 10) * 10 + 10)});
    this.setState({memYMin: (minMem - 10 < DEFAULT_MIN_MEM ? DEFAULT_MIN_MEM : Math.round(maxMem / 10) * 10 - 10)});
  }


  render() {
    return (
      <div className={classes.App}>
        <header className={classes.Header} >
          <h1 className={classes.HeaderText}>Machine Load Monitor</h1>
        </header>

        <div className={classes.ChartsContainer}>
          <LineChart
            className={classes.LeftLineChart}
            title='CPU Load - 10 Minute History'
            yAxisText='Load Average'
            data={this.state.loadData}
            yDomain={[0, this.state.loadYMax]}
            />
          <LineChart
            className={classes.RightLineChart}
            title='Memory Usage - 10 Minute History'
            yAxisText='Used Memory (%)'
            data={this.state.memData}
            yDomain={[this.state.memYMin, this.state.memYMax]}
            />
        </div>

        <div>
          <h2 className={classes.HeaderText}>
            Alerts
          </h2>
          <span className={classes.Details}>
            Load alert threshold set at {this.state.alertThreshold}
          </span>
        </div>
        <div className={classes.ScrollContainer}>
          <ScrollArea
            style={{margin: 'auto', maxWidth: 600, height: 400, maxHeight: 400}}
            speed={0.8}
            >
            {this.state.alerts.map((alert) => (
              <Alert key={alert.timestamp} {...alert} />
            ))}
          </ScrollArea>
        </div>
      </div>
    );
  }
}

export default App;
