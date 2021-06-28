import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { addEntry } from '../actions';
import { removeEntry } from '../utils/api';
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import { white } from '../utils/colors';
import MetricCard from './MetricCard';
import TextButton from './TextButton';

class EntryDetail extends Component {
  // Only re-render if these conditions are met
  shouldComponentUpdate(nextProps) {
    return nextProps.metrics !== null && !nextProps.metrics.today;
  }

  reset = () => {
    const { date, remove, goBack } = this.props;

    remove();
    goBack();
    removeEntry(date);
  };

  render() {
    const { date, metrics } = this.props;

    return (
      <View style={styles.container}>
        <MetricCard metrics={metrics} />
        <TextButton onPress={this.reset} style={{ margin: 20 }}>
          RESET
        </TextButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 15,
  },
});

function mapStateToProps(state, { route }) {
  const { date: dateRoute } = route.params;

  if (state[dateRoute]) {
    const { date, ...metrics } = state[dateRoute][0];

    return {
      date,
      metrics,
    };
  }
  return {
    metrics: null,
  };
}

function mapDispatchToProps(dispatch, { route, navigation }) {
  const { date } = route.params;
  return {
    remove: () =>
      dispatch(
        addEntry({
          [date]: date === timeToString() ? getDailyReminderValue : null,
        })
      ),
    goBack: () => navigation.goBack(),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail);
