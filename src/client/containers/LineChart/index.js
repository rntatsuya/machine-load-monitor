import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as d3 from "d3";
import cx from 'classnames';
import classes from './main.css';


class LineChart extends Component {
  constructor(props) {
    super(props);

    // initialize local state
    const { width, height, margin } = props;
    const actualWidth = width - margin.left - margin.right;
    const actualHeight = height - margin.top - margin.bottom;
    const x = d3.scaleTime()
      .range([0, actualWidth]);

    const y = d3.scaleLinear()
      .range([actualHeight, 0]);

    const xAxis = d3.axisBottom(x).tickArguments([8, d3.timeFormat('%I:%M')]);
    const yAxis = d3.axisLeft(y).tickArguments(8);
    const grid = d3.axisLeft(y).ticks(8).tickSize(-actualWidth).tickFormat('');

    this.state = { x, y, xAxis, yAxis, grid };
  }

  componentWillMount() {
    this.updateStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateFromProps(nextProps);
  }

  // helper func to update the x,y values of local state
  updateStateFromProps = (props) => {
    const x = this.state.x.domain(d3.extent(props.data, d => d.timestamp));
    const y = this.state.y.domain(props.yDomain);
    this.setState({ x, y });
  }

  componentDidMount() {
    const { height, margin, yAxisText } = this.props;
    const { xAxis, yAxis, grid } = this.state;

    // add the X Axis
    d3.select(this.svg).append('g')
      .attr('class', cx(classes.axis, classes.xAxis))
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(xAxis);

    // add the Y Axis
    d3.select(this.svg).append('g')
      .attr('class', cx(classes.axis, classes.yAxis))
      .call(yAxis)
      .append('text')
        .attr('fill', '#000')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .style("font-size", "15px")
        .text(yAxisText)
        .attr("transform", function(d) {
          return "translate(" + -50 + "," + 0 + ") rotate(-90)";
        });

    // add grid
    d3.select(this.svg).insert('g',':first-child')
      .attr('class', classes.grid)
      .call(grid);
  }

  componentWillUpdate() {
    // Update the axes
    const { xAxis, yAxis, grid } = this.state;
    const svg = d3.select(this.svg).transition();
    svg.select(`.${classes.xAxis}`)
      .duration(100)
      .call(xAxis);
    svg.select(`.${classes.yAxis}`)
      .duration(100)
      .call(yAxis);
    svg.select(`.${classes.grid}`)
      .duration(100)
      .call(grid);
  }

  // helper func to create line path
  _renderLine = () => {
    const { data } = this.props;
    const { x, y } = this.state;

    // Add the valueline path.
    const valueline = d3.line()
      .x(d => x(d.timestamp))
      .y(d => y(d.value));

    return valueline(data);
  }

  // helper func to add circles to each datapoint in chart
  _renderCircles = () => {
    const { data } = this.props;
    const { x, y } = this.state;

    // remove circles in previous frame
    d3.select(this.svg).selectAll("circle").remove();

    // add the circles
    d3.select(this.svg).selectAll(classes.dot)
        .data(this.props.data)
      .enter().append("circle")
        .attr("r", 3.5)
        .attr("class", classes.dot)
        .attr("cx", function(d) { return x(d.timestamp) })
        .attr("cy", function(d) { return y(d.value) });
  }

  render() {
    const { title, width, height, margin } = this.props;
    const d = this._renderLine();
    this._renderCircles();

    return (
      <div className={classes.Chart}>
        <h2 className={classes.HeaderText}>
          {title}
        </h2>
        <svg width={width} height={height}>
          <g ref={ref => { this.svg = ref; }} transform={`translate(${margin.left},${margin.top})`}>
            <path className={classes.line} d={d}/>
          </g>
        </svg>
      </div>
    );
  }
};

LineChart.defaultProps = {
  width: 600,
  height: 350,
  margin: { top: 20, right: 20, bottom: 30, left: 50 },
};

LineChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.object,
  yDomain: PropTypes.array.isRequired,
};

export default LineChart;
