// App.js
import React from 'react';
import { View,StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screen/home.js';

import { TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator({navigation, route}) {
  const { userData } = route.params;
  return (
    <Tab.Navigator initialRouteName='Home' screenOptions={{
      tabBarActiveTintColor: 'red',
      tabBarInactiveTintColor: 'black',
    }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ userData }}
        options={{
          header: () => (
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Home</Text>
              <AntDesign name="bells" size={24} color="black" />
            </View>
          ),
          tabBarIcon: ({ color }) => <AntDesign name="home" size={28} color={color} />,
        }}
      />
      
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen 
            name='Login' 
            component={login}
            options={{
              headerShown: false}}
          />
          <Stack.Screen 
            name='Register' 
            component={Register}
            options={{
              headerShown: false}}
          />
        <Stack.Screen 
            name='App' 
            component={TabNavigator}
            options={{
              headerShown: false}}
          />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomColor: 'grey',
    borderBottomWidth: .3,
    paddingTop: 40
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  }, headerProflieContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingTop: 40,
    backgroundColor: 'white',
}
})

