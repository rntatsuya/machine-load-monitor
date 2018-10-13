import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import LineChart from "../LineChart"
import Alert from "../../components/Alert"
import './main.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      alerts: [],
      endpoint: "http://localhost:3000"
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('monitor', data => {this.setState({ data: data }); console.log(data);});
    socket.on('alert', alert => {this.setState({ alerts: [...this.state.alerts, alert] }); console.log("ALERT!!!!!");console.log(this.state.alerts);});
  }


  render() {
    // console.log(this.state.response);

    return (
      <div className="App">
        <LineChart data={this.state.data} yDomain={[0, 4]}/>

        <div>
          {this.state.alerts.map((alert) => (
            <Alert key={alert.timestamp} {...alert} />
          ))}
        </div>
      </div>
    );
  }
}

export default App;
