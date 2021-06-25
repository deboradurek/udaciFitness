import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import History from './components/History';
import AddEntry from './components/AddEntry';
import { Platform, StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import 'react-native-gesture-handler';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { purple, white } from './utils/colors';
// import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

const Tab = Platform.OS === 'ios' ? createBottomTabNavigator() : createMaterialTopTabNavigator();

function UdaciStatusBar({ backgroundColor, ...props }) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
}

class App extends Component {
  // Uncomment to reset local data:
  // AsyncStorage.clear()

  render() {
    return (
      <Provider store={createStore(reducer)}>
        <NavigationContainer>
          {/* <SafeAreaView> */}
          <UdaciStatusBar backgroundColor={purple} barStyle="light-content" />
          {/* </SafeAreaView> */}
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let icon;
                if (route.name === 'History') {
                  icon = <Ionicons name="ios-bookmarks" size={size} color={color} />;
                } else if (route.name === 'AddEntry') {
                  icon = <FontAwesome name="plus-square" size={size} color={color} />;
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
          </Tab.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
