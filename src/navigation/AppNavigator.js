import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/Onboarding/WelcomeScreen';
import TabNavigator from './TabNavigator';
import AddEmployeeScreen from '../screens/Employees/AddEmployeeScreen';
import EmployeeListScreen from '../screens/Employees/EmployeeListScreen';
import EmployeeDetailScreen from '../screens/Employees/EmployeeDetailScreen';
import ActiveMeetingScreen from '../screens/ActiveMeeting/ActiveMeetingScreen';
import AboutCalculationsScreen from '../screens/Settings/AboutCalculationsScreen';
import EmployeeService from '../services/EmployeeService';

const Stack = createStackNavigator();

/**
 * App Navigator
 * Root navigation structure with Welcome flow and Main app
 */
const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState('Welcome');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      // Check if user has at least one employee (indicates completed onboarding)
      const employees = await EmployeeService.getEmployees();
      if (employees.length > 0) {
        setInitialRoute('Main');
      }
    } catch (error) {
      console.error('Error checking onboarding:', error);
    } finally {
      setIsReady(true);
    }
  };

  if (!isReady) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
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
