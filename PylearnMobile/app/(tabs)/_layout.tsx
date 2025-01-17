// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarStyle: { display: 'none' },
      headerShown: false 
    }}>
      <Tabs.Screen 
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen 
        name="auth"
        options={{
          title: 'Auth',
        }}
      />
      <Tabs.Screen 
        name="latihan"
        options={{
          title: 'Latihan',
        }}
      />
      <Tabs.Screen 
        name="materi"
        options={{
          title: 'Materi',
        }}
      />
      <Tabs.Screen 
        name="onlinecomp"
        options={{
          title: 'Online Compiler',
        }}
      />
      <Tabs.Screen 
        name="account"
        options={{
          title: 'Account',
        }}
      />
    </Tabs>
  );
}