import React, { Component } from 'react';
import { View } from 'react-native';
import { getMetricMetaInfo } from '../helpers';

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  };

  /* Methods for run, bike and swim metrics only */

  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);

    this.setState((currentState) => {
      const count = currentState[metric] + step;

      return {
        ...currentState,
        [metric]: count > max ? max : count,
      };
    });
  };

  decrement = (metric) => {
    const { step } = getMetricMetaInfo(metric);

    this.setState((currentState) => {
      const count = currentState[metric] - step;

      return {
        ...currentState,
        [metric]: count < 0 ? 0 : count,
      };
    });
  };

  /* Method for sleep and eat only */

  slider = (metric, value) => {
    this.setState({
      [metric]: value,
    });
  };

  render() {
    return <View>{getMetricMetaInfo('bike').getIcon()}</View>;
  }
}

export default AddEntry;
