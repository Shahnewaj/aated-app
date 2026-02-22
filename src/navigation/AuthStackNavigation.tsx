import { StyleSheet } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SigninScreen from '../screens/SigninScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import { RouteMap } from './RouteMap';

const Stack = createStackNavigator<any>();
const AuthStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={RouteMap.Signin} component={SigninScreen} />
      <Stack.Screen name={RouteMap.Signup} component={SignupScreen} />
      <Stack.Screen
        name={RouteMap.ForgotPassword}
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStackNavigation;

const styles = StyleSheet.create({});
