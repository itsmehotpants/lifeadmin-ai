import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/auth.store';
import { COLORS } from '../theme';
import { LayoutDashboard, CheckSquare, Settings } from 'lucide-react-native';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TasksScreen from '../screens/TasksScreen';
import HabitsScreen from '../screens/HabitsScreen';
import FinanceScreen from '../screens/FinanceScreen';
import GoalsScreen from '../screens/GoalsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Target, CreditCard, TrendingUp, BarChart3, Settings, LayoutDashboard, CheckSquare } from 'lucide-react-native';

import { registerForPushNotificationsAsync } from '../lib/notifications';
import { Platform } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111118',
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
      }}
    >
      <Tab.Screen 
         name="Home" 
         component={DashboardScreen} 
         options={{
            tabBarIcon: ({color, size}) => <LayoutDashboard color={color} size={size} />
         }}
      />
      <Tab.Screen 
         name="Tasks" 
         component={TasksScreen} 
         options={{
            tabBarIcon: ({color, size}) => <CheckSquare color={color} size={size} />
         }}
      />
      <Tab.Screen 
         name="Habits" 
         component={HabitsScreen} 
         options={{
            tabBarIcon: ({color, size}) => <Target color={color} size={size} />
         }}
      />
      <Tab.Screen 
         name="Finance" 
         component={FinanceScreen} 
         options={{
            tabBarIcon: ({color, size}) => <CreditCard color={color} size={size} />
         }}
      />
      <Tab.Screen 
         name="Family" 
         component={FamilyScreen} 
         options={{
            tabBarIcon: ({color, size}) => <Users color={color} size={size} />
         }}
      />
      <Tab.Screen 
         name="Settings" 
         component={SettingsScreen} 
         options={{
            tabBarIcon: ({color, size}) => <Settings color={color} size={size} />
         }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          api.post('/notifications/fcm-token', {
            token,
            platform: Platform.OS.toUpperCase(),
          }).catch(err => console.error("Error registering FCM token:", err));
        }
      });
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="Goals" component={GoalsScreen} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
