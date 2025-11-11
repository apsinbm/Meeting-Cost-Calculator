import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import MeetingPredictorScreen from '../screens/MeetingPredictor/MeetingPredictorScreen';
import StartMeetingScreen from '../screens/StartMeeting/StartMeetingScreen';
import HistoryScreen from '../screens/History/HistoryScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import { Colors, FontSizes } from '../constants';

const Tab = createBottomTabNavigator();

// Rich royal blue color for icons
const ICON_COLOR_ACTIVE = '#1E40AF'; // Darker royal blue
const ICON_COLOR_INACTIVE = '#94A3B8'; // Light gray

/**
 * Bottom Tab Navigator
 * Main app navigation with 4 tabs: Calculate, Start, History, Settings
 */
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ICON_COLOR_ACTIVE,
        tabBarInactiveTintColor: ICON_COLOR_INACTIVE,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          backgroundColor: Colors.background,
          height: 70,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 0,
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Calculate"
        component={MeetingPredictorScreen}
        options={{
          tabBarLabel: 'Calculate',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 12, color, fontWeight: 'bold', lineHeight: 18 }}>123</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Start"
        component={StartMeetingScreen}
        options={{
          tabBarLabel: 'Start',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color, fontWeight: 'bold', lineHeight: 18 }}>▶</Text>
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color, fontWeight: 'bold', lineHeight: 18 }}>◔</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color, fontWeight: 'bold', lineHeight: 18 }}>⚙</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
