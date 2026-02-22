import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import { RouteMap } from './RouteMap';
import BottomTabnavigator from './BottomTabnavigator';
import ProfileScreen from '../screens/ProfileScreen';
import AccountScreen from '../screens/AccountScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import JobExperiencesScreen from '../screens/JobExperiencesScreen';
import AddEditExperienceScreen from '../screens/AddEditExperienceScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import MemberDetailsScreen from '../screens/MemberDetailsScreen';
import CommitteeDetailsScreen from '../screens/CommitteeDetailsScreen';
import PostDetailsScreen from '../screens/PostDetailsScreen';
import AddEditPostScreen from '../screens/AddEditPostScreen';

const Stack = createNativeStackNavigator();

const AppStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={RouteMap.TabStack} component={BottomTabnavigator} />
      <Stack.Screen name={RouteMap.Account} component={AccountScreen} />
      <Stack.Screen name={RouteMap.EditProfile} component={EditProfileScreen} />
      <Stack.Screen
        name={RouteMap.JobExperiences}
        component={JobExperiencesScreen}
      />
      <Stack.Screen
        name={RouteMap.AddEditExperience}
        component={AddEditExperienceScreen}
      />
      <Stack.Screen
        name={RouteMap.ChangePassword}
        component={ChangePasswordScreen}
      />
      <Stack.Screen
        name={RouteMap.CommitteeDetails}
        component={CommitteeDetailsScreen}
      />
      <Stack.Screen
        name={RouteMap.MemberDetails}
        component={MemberDetailsScreen}
      />
      <Stack.Screen name={RouteMap.PostDetails} component={PostDetailsScreen} />
      <Stack.Screen name={RouteMap.AddEditPost} component={AddEditPostScreen} />
    </Stack.Navigator>
  );
};

export default AppStackNavigation;

const styles = StyleSheet.create({});
