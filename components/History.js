import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { fetchCalendarResults } from '../utils/api';
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import { receiveEntries, addEntry } from '../actions';
import { Agenda } from 'react-native-calendars';

class History extends Component {
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
      });
  }

  renderItem = ({ today, ...metrics }, formattedDate, key) => (
    <View>
      {today ? <Text>{JSON.stringify(today)}</Text> : <Text>{JSON.stringify(metrics)}</Text>}
    </View>
  );

  renderEmptyDate = (formattedDate) => {
    return (
      <View>
        <Text>No data for this day.</Text>
      </View>
    );
  };

  render() {
    const { entries } = this.props;
    console.log(entries);

    return (
      //   <Text>{JSON.stringify(this.props)}</Text>
      <Agenda items={entries} renderItem={this.renderItem} renderEmptyDate={this.renderEmptyDate} />
    );
  }
}

function mapStateToProps(entries) {
  return {
    entries,
  };
}

export default connect(mapStateToProps)(History);
