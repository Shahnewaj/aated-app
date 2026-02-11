import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import {RouteMap} from './RouteMap';
import BottomTabnavigator from './BottomTabnavigator';

const AppStack = createNativeStackNavigator();

const AppStackNavigation = () => {
  return (
    <AppStack.Navigator screenOptions={{headerShown: false}}>
      <AppStack.Screen
        name={RouteMap.TabStack}
        component={BottomTabnavigator}
      />
      <AppStack.Screen name={RouteMap.Home} component={HomeScreen} />
    </AppStack.Navigator>
  );
};

export default AppStackNavigation;

const styles = StyleSheet.create({});
