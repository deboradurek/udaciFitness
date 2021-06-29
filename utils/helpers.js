import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { white, red, orange, blue, lightPurp, pink } from './colors';
import * as Notifications from 'expo-notifications';
import { AsyncStorage } from '@react-native-async-storage/async-storage';

const NOTIFICATION_KEY = 'UdaciFitness:notifications';

/* Check if number is between function */

export function isBetween(num, x, y) {
  if (num >= x && num <= y) {
    return true;
  }

  return false;
}

/* Calculate direction function */

export function calculateDirection(heading) {
  let direction = '';

  if (isBetween(heading, 0, 22.5)) {
    direction = 'North';
  } else if (isBetween(heading, 22.5, 67.5)) {
    direction = 'North East';
  } else if (isBetween(heading, 67.5, 112.5)) {
    direction = 'East';
  } else if (isBetween(heading, 112.5, 157.5)) {
    direction = 'South East';
  } else if (isBetween(heading, 157.5, 202.5)) {
    direction = 'South';
  } else if (isBetween(heading, 202.5, 247.5)) {
    direction = 'South West';
  } else if (isBetween(heading, 247.5, 292.5)) {
    direction = 'West';
  } else if (isBetween(heading, 292.5, 337.5)) {
    direction = 'North West';
  } else if (isBetween(heading, 337.5, 360)) {
    direction = 'North';
  } else {
    direction = '...';
  }

  return direction;
}

/* Transform time to string function */

export function timeToString(time = Date.now()) {
  const date = new Date(time);
  const todayUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  return todayUTC.toISOString().split('T')[0];
}

/* Styles */

const styles = StyleSheet.create({
  iconContainer: {
    padding: 5,
    borderRadius: 8,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
});

/* Meta Info function */

export function getMetricMetaInfo(metric) {
  const info = {
    run: {
      displayName: 'Run',
      max: 50,
      unit: 'miles',
      step: 1,
      type: 'steppers',
      getIcon() {
        return (
          <View style={[styles.iconContainer, { backgroundColor: red }]}>
            <MaterialIcons name="directions-run" color={white} size={35} />
          </View>
        );
      },
    },
    bike: {
      displayName: 'Bike',
      max: 100,
      unit: 'miles',
      step: 1,
      type: 'steppers',
      getIcon() {
        return (
          <View style={[styles.iconContainer, { backgroundColor: orange }]}>
            <MaterialCommunityIcons name="bike" color={white} size={35} />
          </View>
        );
      },
    },
    swim: {
      displayName: 'Swim',
      max: 9900,
      unit: 'meters',
      step: 100,
      type: 'steppers',
      getIcon() {
        return (
          <View style={[styles.iconContainer, { backgroundColor: blue }]}>
            <MaterialCommunityIcons name="swim" color={white} size={35} />
          </View>
        );
      },
    },
    sleep: {
      displayName: 'Sleep',
      max: 24,
      unit: 'hours',
      step: 1,
      type: 'slider',
      getIcon() {
        return (
          <View style={[styles.iconContainer, { backgroundColor: lightPurp }]}>
            <FontAwesome name="bed" color={white} size={35} />
          </View>
        );
      },
    },
    eat: {
      displayName: 'Eat',
      max: 10,
      unit: 'rating',
      step: 1,
      type: 'slider',
      getIcon() {
        return (
          <View style={[styles.iconContainer, { backgroundColor: pink }]}>
            <MaterialCommunityIcons name="food" color={white} size={35} />
          </View>
        );
      },
    },
  };

  return typeof metric === 'undefined' ? info : info[metric];
}

/* Get daily reminder function */

export function getDailyReminderValue() {
  return [
    {
      today: "👋  Don't forget to log your data today!",
    },
  ];
}

/* Push Notification */

// Clear All Notifications

export function clearAllNotifications() {
  return AsyncStorage.removeItem(NOTIFICATION_KEY).then(
    Notifications.cancelAllScheduledNotificationsAsync
  );
}

// Function to represent the notification
// function createNotification() {
//   return {
//     title: 'Log your stats',
//     body: "👋 Don't forget to log your stats for today!",
//     ios: { sound: true },
//     android: { sound: true, priority: 'high', sticky: false, vibrate: true },
//   };
// }

// Set Notification

export function setLocalNotification() {
  return AsyncStorage.getItem(NOTIFICATION_KEY)
    .then(JSON.parse)
    .then((data) => {
      if (data === null) {
        Notifications.requestPermissionsAsync().then(({ status }) => {
          if (status === 'granted') {
            Notifications.cancelAllScheduledNotificationsAsync();

            // let tomorrow = new Date();
            // tomorrow.setDate(tomorrow.getDate() + 1);
            // tomorrow.setHours(20);
            // tomorrow.setMinutes(0);

            Notifications.scheduleNotificationAsync(
              // createNotification()
              {
                identifier: 'createNotification',
                content: {
                  title: 'Log your stats',
                  body: "👋 Don't forget to log your stats for today!",
                  sound: true,
                },
                trigger: {
                  hour: 20,
                  minute: 0,
                  repeats: true,
                },
              }
            );

            AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true));

            // Notifications.setNotificationHandler({
            //     handleNotification: async () => ({
            //       shouldShowAlert: true,
            //       shouldPlaySound: true,
            //       shouldSetBadge: true,
            //     }),
            //   });
          }
        });
      }
    });
}
