import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

class Live extends Component {
  state = {
    coord: null,
    status: null,
    direction: '',
  };

  render() {
    const { coord, status, direction } = this.state;

    // If the user hasn't given access permission yet
    if (status === null) {
      return <ActivityIndicator style={{ marginTop: 30 }} />;
    }

    // If the user denied access permission
    if (status === 'denied') {
      return (
        <View>
          <Text>Denied</Text>
        </View>
      );
    }

    if (status === 'undetermined') {
      return (
        <View>
          <Text>Undetermined</Text>
        </View>
      );
    }

    return (
      <View>
        <Text>{JSON.stringify(this.state)}</Text>
      </View>
    );
  }
}

export default Live;
