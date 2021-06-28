import React, { Component } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Foundation } from '@expo/vector-icons';
import { purple, white } from '../utils/colors';

class Live extends Component {
  state = {
    coord: null,
    status: 'denied',
    direction: '',
  };

  askPermission = () => {};

  render() {
    const { coord, status, direction } = this.state;

    // If the user hasn't yet given permission to access their location
    if (status === null) {
      return <ActivityIndicator style={{ marginTop: 30 }} />;
    }

    // If the user denied permission to access their location
    if (status === 'denied') {
      return (
        <View style={styles.center}>
          <Foundation name="alert" size={50} />
          <Text>
            You denied your location. You can fix this by visiting your settings and enabling
            location services for this app.
          </Text>
        </View>
      );
    }

    // If the user neither denies nor grants permission to access their location
    if (status === 'undetermined') {
      return (
        <View style={styles.center}>
          <Foundation name="alert" size={50} />
          <Text>You need to enable location services for this app.</Text>
          <TouchableOpacity onPress={this.askPermission} style={styles.button}>
            <Text style={styles.buttonText}>Enable</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // If the user grants permission to access their location
    return (
      <View>
        <Text>{JSON.stringify(this.state)}</Text>
      </View>
    );
  }
}

/* Styles */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
  button: {
    padding: 10,
    backgroundColor: purple,
    alignSelf: 'center',
    borderRadius: 5,
    margin: 20,
  },
  buttonText: {
    color: white,
    fontSize: 20,
  },
});

export default Live;
