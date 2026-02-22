import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, View } from 'react-native';
import { RouteMap } from './RouteMap';
import { useAppSelector } from '../lib/store/hooks';
import _ from 'lodash';
import HomeScreen from '../screens/HomeScreen';
import CommitteeScreen from '../screens/CommitteeScreen';
import MembersScreen from '../screens/MembersScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AccountScreen from '../screens/AccountScreen';

const BottomTabnavigator = () => {
  const { user } = useAppSelector(state => state.user);
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName={RouteMap.Home}
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#4F63FF',
        tabBarInactiveTintColor: '#5A6080',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name={RouteMap.Home}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : null}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
          tabBarLabel: 'Home',
        }}
      />

      <Tab.Screen
        name={RouteMap.Member}
        component={MembersScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : null}>
              <Ionicons
                name={focused ? 'people' : 'people-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
          tabBarLabel: 'Members',
        }}
      />

      <Tab.Screen
        name={RouteMap.Committee}
        component={CommitteeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : null}>
              <Ionicons
                name={focused ? 'briefcase' : 'briefcase-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
          tabBarLabel: 'Committee',
        }}
      />

      <Tab.Screen
        name={RouteMap.Account}
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : null}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabnavigator;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 25 : 15,
    left: 20,
    right: 20,
    backgroundColor: '#161B3A',
    borderRadius: 25,
    height: 70,
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 5,
  },
  tabBarItem: {
    height: 60,
  },
  activeIconWrap: {
    backgroundColor: '#4F63FF15',
    padding: 8,
    borderRadius: 14,
    marginBottom: 4,
  },
});
