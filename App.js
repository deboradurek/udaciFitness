import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import History from './components/History';
import AddEntry from './components/AddEntry';
import EntryDetail from './components/EntryDetail';
import Live from './components/Live';
import 'react-native-gesture-handler';
import { Platform, StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { purple, white } from './utils/colors';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLocalNotification } from './utils/helpers';

// Status Bar
function UdaciStatusBar({ backgroundColor, ...props }) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
}

// Create TabNavigator
const Tab = Platform.OS === 'ios' ? createBottomTabNavigator() : createMaterialTopTabNavigator();

function TabNav() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let icon;
          if (route.name === 'History') {
            icon = <Ionicons name="ios-bookmarks" size={size} color={color} />;
          } else if (route.name === 'AddEntry') {
            icon = <FontAwesome name="plus-square" size={size} color={color} />;
          } else if (route.name === 'Live') {
            icon = <Ionicons name="ios-speedometer" size={size} color={color} />;
          }
          return icon;
        },
      })}
      tabBarOptions={{
        activeTintColor: Platform.OS === 'ios' ? purple : white,
        inactiveTintColor: 'gray',
        style: {
          backgroundColor: Platform.OS === 'ios' ? white : purple,
          shadowColor: 'rgba(0,0,0,0.24)',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowRadius: 6,
          shadowOpacity: 1,
        },
      }}
    >
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="AddEntry" component={AddEntry} />
      <Tab.Screen name="Live" component={Live} />
    </Tab.Navigator>
  );
}

// Create StackNavigator
const Stack = createStackNavigator();

function StackNav() {
  return (
    <Stack.Navigator initialRouteName="History" headerMode="screen">
      <Stack.Screen name="History" component={TabNav} options={{ headerShown: false }} />
      <Stack.Screen
        name="EntryDetail"
        component={EntryDetail}
        options={({ route }) => ({
          headerTintColor: white,
          headerStyle: {
            backgroundColor: purple,
          },
          title: route.params.date,
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
}

class App extends Component {
  componentDidMount() {
    setLocalNotification();
    // Uncomment to reset local data:
    AsyncStorage.clear();
  }

  render() {
    return (
      <Provider store={createStore(reducer)}>
        <NavigationContainer>
          <UdaciStatusBar backgroundColor={purple} barStyle="light-content" />
          <StackNav />
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
