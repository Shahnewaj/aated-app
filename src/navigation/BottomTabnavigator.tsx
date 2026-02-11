import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform, StyleSheet, View} from 'react-native';
import {RouteMap} from './RouteMap';
import {useAppSelector} from '../lib/store/hooks';
import _ from 'lodash';
import HomeScreen from '../screens/HomeScreen';
import CommitteeScreen from '../screens/CommitteeScreen';
import MembersScreen from '../screens/MembersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BottomTabnavigator = () => {
  const {user} = useAppSelector(state => state.user);
  const isInternalUser =
    user?.user?.role &&
    !_.isEmpty(user?.user?.role) &&
    user?.user?.role?.permissions?.length > 0;
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName={RouteMap.Home}
      backBehavior="history"
      screenOptions={{headerShown: false}}>
      <Tab.Screen
        name={RouteMap.Home}
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
              style={styles.icon}
            />
          ),
          tabBarLabel: 'Home',
        }}
      />

      <Tab.Screen
        name={RouteMap.Member}
        component={MembersScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name="people-outline"
              size={size}
              color={color}
              style={styles.icon}
            />
          ),
          tabBarLabel: 'Members',
        }}
      />
      <Tab.Screen
        name={RouteMap.Committee}
        component={CommitteeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name="file-tray-outline"
              size={size}
              color={color}
              style={styles.icon}
            />
          ),
          tabBarLabel: 'Committee',
        }}
      />
      <Tab.Screen
        name={RouteMap.Profile}
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={color}
              style={styles.icon}
            />
          ),
          tabBarLabel: 'Committee',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabnavigator;

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    borderRadius: 50,
    width: 24,
    height: 24,
  },
});
