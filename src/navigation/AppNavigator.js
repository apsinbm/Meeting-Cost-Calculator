import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/Onboarding/WelcomeScreen';
import TabNavigator from './TabNavigator';
import AddEmployeeScreen from '../screens/Employees/AddEmployeeScreen';
import EmployeeListScreen from '../screens/Employees/EmployeeListScreen';
import EmployeeDetailScreen from '../screens/Employees/EmployeeDetailScreen';
import ActiveMeetingScreen from '../screens/ActiveMeeting/ActiveMeetingScreen';
import AboutCalculationsScreen from '../screens/Settings/AboutCalculationsScreen';

const Stack = createStackNavigator();

/**
 * App Navigator
 * Root navigation structure with Welcome flow and Main app
 */
const AppNavigator = () => {
  // TODO: Check if user has completed onboarding
  // For now, always show welcome screen first

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="AddEmployee" component={AddEmployeeScreen} />
        <Stack.Screen name="EmployeeList" component={EmployeeListScreen} />
        <Stack.Screen name="EmployeeDetail" component={EmployeeDetailScreen} />
        <Stack.Screen name="ActiveMeeting" component={ActiveMeetingScreen} />
        <Stack.Screen name="AboutCalculations" component={AboutCalculationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
