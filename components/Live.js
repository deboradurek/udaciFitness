import React, { Component } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Foundation } from '@expo/vector-icons';
import { purple, white } from '../utils/colors';
import * as Location from 'expo-location';
import { calculateDirection } from '../utils/helpers';

class Live extends Component {
  state = {
    coords: null,
    status: null,
    direction: '',
    bounceValue: new Animated.Value(1),
  };
  location = null;

  async componentDidMount() {
    Location.getForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status === 'granted') {
          return this.setLocation();
        }

        this.setState({
          status,
        });
      })
      .catch((error) => {
        console.warn('Error getting location permission: ', error);
        this.setState({
          status: 'undetermined',
        });
      });
  }

  componentWillUnmount() {
    this.location.remove();
  }

  askPermission = () => {
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status === 'granted') {
          return this.setLocation();
        }

        this.setState({
          status,
        });
      })
      .catch((error) => {
        console.warn('Error requesting permission to access location: ', error);
      });
  };

  setLocation = async () => {
    this.location = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1,
        distanceInterval: 1,
      },
      ({ coords }) => {
        const newDirection = calculateDirection(coords.heading);
        const { direction, bounceValue } = this.state;

        if (newDirection !== direction) {
          Animated.sequence([
            Animated.timing(bounceValue, { duration: 200, toValue: 1.04, useNativeDriver: true }),
            Animated.spring(bounceValue, { friction: 5, toValue: 1, useNativeDriver: true }),
          ]).start();
        }

        this.setState({
          coords,
          status: 'granted',
          direction: newDirection,
        });
      }
    );
  };

  render() {
    const { coords, status, direction, bounceValue } = this.state;

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
      <View style={styles.container}>
        <View style={styles.directionContainer}>
          <Text style={styles.header}>You're heading</Text>
          <Animated.Text style={[styles.direction, { transform: [{ scale: bounceValue }] }]}>
            {direction}
          </Animated.Text>
        </View>
        <View style={styles.metricContainer}>
          <View style={styles.metric}>
            <Text style={[styles.subHeader, { color: white }]}>Altitude</Text>
            <Text style={[styles.subHeader, { color: white }]}>
              {Math.round(coords.altitude * 3.2808)} feet
            </Text>
          </View>
          <View style={styles.metric}>
            <Text style={[styles.subHeader, { color: white }]}>Speed</Text>
            <Text style={[styles.subHeader, { color: white }]}>
              {(coords.speed * 3.6).toFixed(1)} KMH
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

/* Styles */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
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
  directionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 35,
    textAlign: 'center',
  },
  direction: {
    color: purple,
    fontSize: 120,
    textAlign: 'center',
  },
  metricContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: purple,
  },
  metric: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  subHeader: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default Live;
