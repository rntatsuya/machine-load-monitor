import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import ScrollArea from 'react-scrollbar';

import LineChart from "../LineChart"
import Alert from "../../components/Alert"
import classes from './main.css';

const DEFAULT_MAX_LOAD = 4;
const DEFAULT_MAX_MEM = 100;
const DEFAULT_MIN_MEM = 0;

class App extends Component {
  constructor() {
    super();
    this.state = {
      loadData: [],
      memData: [],
      alerts: [],
      loadYMax: DEFAULT_MAX_LOAD,
      memYMax: DEFAULT_MAX_MEM,
      memYMin: DEFAULT_MIN_MEM,
      alertThreshold: 1,
      endpoint: "http://localhost:3000"
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('load-monitor', data => {
      this.setState({ loadData: data });
      console.log("Load");
      console.log(data);
      this.adjustLoadYMax();
    });
    socket.on('mem-monitor', data => {
      this.setState({ memData: data });
      console.log("Mem");
      console.log(data);
      this.adjustMemYMaxMin();
    });
    socket.on('alert', alert => {
      this.setState({ alerts: [alert, ...this.state.alerts] });
      console.log("ALERT!!!!!");
      console.log(this.state.alerts);
    });
  }

  adjustLoadYMax = () => {
    const maxLoad = this.state.loadData.reduce((prev, cur) => (prev.value > cur.value) ? prev : cur).value;
    console.log("MAXXX");
    console.log(maxLoad);
    if (maxLoad <= DEFAULT_MAX_LOAD) {
      this.setState({loadYMax: DEFAULT_MAX_LOAD});
    }
    else {
      this.setState({loadYMax: Math.trunc(maxLoad + 1)});
    }
  }

  adjustMemYMaxMin = () => {
    const maxMem = this.state.memData.reduce((prev, cur) => (prev.value > cur.value) ? prev : cur).value;
    const minMem = this.state.memData.reduce((prev, cur) => (prev.value < cur.value) ? prev : cur).value;
    console.log("MAXXX");
    console.log(maxMem);
    this.setState({memYMax: (maxMem + 10 > DEFAULT_MAX_MEM ? DEFAULT_MAX_MEM : Math.round(maxMem / 10) * 10 + 10)});
    this.setState({memYMin: (minMem - 10 < DEFAULT_MIN_MEM ? DEFAULT_MIN_MEM : Math.round(maxMem / 10) * 10 - 10)});
  }


  render() {

    return (
      <div className={classes.App}>
        <header className={classes.Header} >
          <h1 className={classes.HeaderText}>Machine Load Monitor</h1>
        </header>


        <div style={{display: 'flex', flexDirection: 'row'}}>
            <LineChart className={classes.LeftLineChart} title='CPU Load - 10 Minute History' yAxisText='Load Average' data={this.state.loadData} yDomain={[0, this.state.loadYMax]}/>
            <LineChart className={classes.RightLineChart} title='Memory Usage - 10 Minute History' yAxisText='Used Memory (%)' data={this.state.memData} yDomain={[this.state.memYMin, this.state.memYMax]}/>
        </div>

        <div>
          <h2 className={classes.HeaderText}>
            Alerts
          </h2>
          <span className={classes.Details}>Load alert threshold set at {this.state.alertThreshold}</span>
        </div>
          <div style={{textAlign: 'center'}}>
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
