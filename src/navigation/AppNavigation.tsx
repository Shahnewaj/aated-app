import React, {useRef} from 'react';
import AuthStackNavigation from './AuthStackNavigation';
import {createNavigationContainerRef} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {useAppSelector} from '../lib/store/hooks';
import _ from 'lodash';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteMap} from './RouteMap';
import analytics from '@react-native-firebase/analytics';
import AppStackNavigation from './AppStackNavigation';

const RootStack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

const AppNavigation = () => {
  const {user} = useAppSelector(state => state.user);
  const routeNameRef = useRef<any>(null);
  return (
    <NavigationContainer
      onReady={() => {
        routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName =
          navigationRef?.current?.getCurrentRoute()?.name;
        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}
      ref={navigationRef}>
      <RootStack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerShown: false,
        }}
        initialRouteName={
          !_.isEmpty(user) ? RouteMap.AuthStack : RouteMap.AppStack
        }>
        {!_.isEmpty(user) ? (
          <RootStack.Screen
            name={RouteMap.AuthStack}
            component={AuthStackNavigation}
          />
        ) : (
          <RootStack.Screen
            name={RouteMap.AppStack}
            component={AppStackNavigation}
          />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
