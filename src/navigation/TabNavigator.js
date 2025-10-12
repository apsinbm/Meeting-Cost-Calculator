import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TodayScreen from '../screens/Today/TodayScreen';
import HistoryScreen from '../screens/History/HistoryScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import { Colors, FontSizes } from '../constants';

const Tab = createBottomTabNavigator();

/**
 * Bottom Tab Navigator
 * Main app navigation with Today, History, and Settings tabs
 */
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray500,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          backgroundColor: Colors.background,
        },
        tabBarLabelStyle: {
          fontSize: FontSizes.xs,
        },
      }}
    >
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          tabBarLabel: 'Today',
          // TODO: Add icon when icon library available
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          // TODO: Add icon when icon library available
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          // TODO: Add icon when icon library available
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
