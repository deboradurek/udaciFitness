import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers';
import { submitEntry, removeEntry } from '../utils/api';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';
import DateHeader from './DateHeader';
import { Ionicons } from '@expo/vector-icons';
import TextButton from './TextButton';
import { connect } from 'react-redux';
import { addEntry } from '../actions';
import { purple, white } from '../utils/colors';
import { CommonActions } from '@react-navigation/native';

/* Button Component */

function SubmitBtn({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
    >
      <Text style={styles.submitBtnText}>SUBMIT</Text>
    </TouchableOpacity>
  );
}

/* Main AddEntry Component */

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

  /* Method to navigate back to Home */
  toHome = () => {
    this.props.navigation.dispatch({
      ...CommonActions.goBack(),
      source: 'AddEntry',
    });
  };

  /* Method for submit button */

  submit = () => {
    const key = timeToString();
    const entry = [{ ...this.state, date: key }];
    const { dispatch } = this.props;

    // Update Redux
    dispatch(
      addEntry({
        [key]: entry,
      })
    );

    // Set new state
    this.setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    });

    // TODO: Navigate to Home
    this.toHome();

    // Save to database (local storage)
    submitEntry({ key, entry });

    // TODO: Clear local notification
  };

  /* */

  reset = () => {
    const key = timeToString();

    const { dispatch } = this.props;

    // Update Redux
    dispatch(
      addEntry({
        [key]: getDailyReminderValue(),
      })
    );

    // TODO: Navigate to Home

    // Save to database (local storage)
    removeEntry(key);
  };

  render() {
    const metaInfo = getMetricMetaInfo();

    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'} size={100} />
          <Text>You already logged your information for today.</Text>
          <TextButton onPress={this.reset} style={{ padding: 10 }}>
            Reset
          </TextButton>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <DateHeader date={new Date().toLocaleDateString()} />
        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];

          return (
            <View key={key} style={styles.row}>
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

        <SubmitBtn onPress={this.submit} />
      </View>
    );
  }
}

/* Styles */

const styles = StyleSheet.create({
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
    marginLeft: 30,
  },
});

function mapStateToProps(state) {
  const key = timeToString();

  return {
    alreadyLogged: state[key] && state[key][0].today === undefined,
  };
}

export default connect(mapStateToProps)(AddEntry);
