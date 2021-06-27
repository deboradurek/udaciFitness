import React, { Component } from 'react';
import { View, Text } from 'react-native';

class EntryDetail extends Component {
  render() {
    const { date } = this.props.route.params;

    return (
      <View>
        <Text>Entry Detail - {date}</Text>
      </View>
    );
  }
}

export default EntryDetail;
