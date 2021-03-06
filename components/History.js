import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { fetchCalendarResults } from '../utils/api';
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import { receiveEntries, addEntry } from '../actions';
import { Agenda } from 'react-native-calendars';
import { white } from '../utils/colors';
import MetricCard from './MetricCard';

// import { AppLoading } from 'expo';

// For Android
import AppLoading from 'expo-app-loading';

class History extends Component {
  state = {
    ready: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    fetchCalendarResults()
      .then((entries) => dispatch(receiveEntries(entries)))
      .then(({ entries }) => {
        if (!entries[timeToString()]) {
          dispatch(
            addEntry({
              [timeToString()]: getDailyReminderValue(),
            })
          );
        }
      })
      .then(() => this.setState({ ready: true }));
  }

  renderItem = ({ today, date, ...metrics }) => (
    <View style={styles.item}>
      {today ? (
        <View>
          <Text style={styles.noDataText}>{today}</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={() => this.props.navigation.navigate('EntryDetail', { date })}>
          <MetricCard metrics={metrics} />
        </TouchableOpacity>
      )}
    </View>
  );

  renderEmptyDate = () => {
    return (
      <View style={styles.item}>
        <Text style={styles.noDataText}>You didn't log any data on this day.</Text>
      </View>
    );
  };

  render() {
    const { entries } = this.props;
    const { ready } = this.state;

    if (ready === false) {
      return <AppLoading />;
    }

    return (
      //   <Text>{JSON.stringify(this.props)}</Text>
      <Agenda
        items={entries}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
        selected
      />
    );
  }
}

/* Styles */

const styles = StyleSheet.create({
  item: {
    backgroundColor: white,
    borderRadius: Platform.OS === 'ios' ? 16 : 2,
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 17,
    justifyContent: 'center',
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0,0,0,0.24)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  noDataText: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

function mapStateToProps(entries) {
  return {
    entries,
  };
}

export default connect(mapStateToProps)(History);
