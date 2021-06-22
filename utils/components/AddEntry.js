import React, { Component } from 'react';
import { View } from 'react-native';
import { getMetricMetaInfo } from '../helpers';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';
import DateHeader from './DateHeader';

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

  slide = (metric, value) => {
    this.setState({
      [metric]: value,
    });
  };

  render() {
    const metaInfo = getMetricMetaInfo();

    return (
      <View>
        <DateHeader date={new Date().toLocaleDateString()} />
        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];

          return (
            <View key={key}>
              {getIcon()}
              {type === 'slider' ? (
                <UdaciSlider value={value} onChange={(value) => this.slide(key, value)} {...rest} />
              ) : (
                <UdaciSteppers
                  value={value}
                  onIncrement={() => this.increment(key)}
                  onDecrement={() => this.decrement(key)}
                  {...rest}
                />
              )}
            </View>
          );
        })}
      </View>
    );
  }
}

export default AddEntry;
