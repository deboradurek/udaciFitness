import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import MetricCard from './MetricCard';
import { white } from '../utils/colors';

class EntryDetail extends Component {
  render() {
    const { date, ...metrics } = this.props.metrics[0];

    return (
      <View style={styles.container}>
        <MetricCard metrics={metrics} />
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
  const { date } = route.params;

  return {
    metrics: state[date],
  };
}

export default connect(mapStateToProps)(EntryDetail);
