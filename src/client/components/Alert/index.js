import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import classes from './main.css';

const Alert = (props) => {
  const { isAlert } = props;

  return (
    <div className={classes.Alert}>
      <div className={classes.MessageContainer}>
        <img
          className={classes.Img}
          src={isAlert ? "/img/alert.png" : "/img/recover.png"} alt="" />
        <span>
          <h3 className={classes.AlertText}>{isAlert ? 'High load generated an alert' : 'Alert recovered'}</h3>
          <h4 className={classes.DetailsText}>{`2 Minute Load Avg. = ${props.loadAvg}, at ${new Date(props.timestamp).toLocaleTimeString()}`}</h4>
        </span>
      </div>
    </div>
  );
};

Alert.propTypes = {
  loadAvg: PropTypes.number.isRequired,
  isAlert: PropTypes.bool.isRequired,
  timestamp: PropTypes.number.isRequired,
};

export default Alert;
