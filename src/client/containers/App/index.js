import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import ScrollArea from 'react-scrollbar';
import { Container, Row, Col } from 'reactstrap';

import LineChart from "../LineChart"
import Alert from "../../components/Alert"
import classes from './main.css';

const DEFAULT_MAX_LOAD = 4;

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      alerts: [],
      yMax: DEFAULT_MAX_LOAD,
      endpoint: "http://localhost:3000"
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('monitor', data => {
      this.setState({ data: data });
      console.log(data);
      this.adjustYMax();
    });
    socket.on('alert', alert => {
      this.setState({ alerts: [alert, ...this.state.alerts] });
      console.log("ALERT!!!!!");
      console.log(this.state.alerts);
    });


  }

  adjustYMax = () => {
    const maxLoad = this.state.data.reduce((prev, cur) => (prev.load > cur.load) ? prev : cur).load;
    console.log("MAXXX");
    console.log(maxLoad);
    if (maxLoad <= DEFAULT_MAX_LOAD) {
      this.setState({yMax: DEFAULT_MAX_LOAD});
    }
    else {
      this.setState({yMax: Math.trunc(maxLoad + 1)});
    }
  }


  render() {

    return (
      <div className={classes.App}>
        <header className={classes.Header} >
          <h1 className={classes.HeaderText}>Machine Load Monitor</h1>
        </header>


        <div style={{display: 'flex', flexDirection: 'row'}}>
            <LineChart style={{flexGrow: 1}} title='10 Minute CPU Load History' data={this.state.data} yDomain={[0, this.state.yMax]}/>
            <LineChart style={{flexGrow: 1}} title='10 Minute Free Memory History' data={this.state.data} yDomain={[0, this.state.yMax]}/>
        </div>

          <h2 className={classes.HeaderText}>
            Alerts
          </h2>
          <div style={{textAlign: 'center'}}>
          <ScrollArea
              style={{margin: 'auto', maxWidth: 600, height: 400, maxHeight: 400}}
              speed={0.8}
              className="area"
              contentClassName="content"
              horizontal={false}
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
