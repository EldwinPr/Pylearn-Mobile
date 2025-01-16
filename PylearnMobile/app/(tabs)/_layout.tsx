import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { Home, Plane } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3670a1',
        tabBarBackground: () => (
          <View style={{ backgroundColor: '#fff', height: '100%' }} />
        ),
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute'
          },
          default: {}
        })
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={28} color={color} />
        }}
      />
      <Tabs.Screen 
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <Plane size={28} color={color} />
        }}
      />
    </Tabs>
  );
}