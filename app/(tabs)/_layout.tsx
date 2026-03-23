import { Redirect, SplashScreen, Tabs } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { TabBarIcon } from '~/components/tab-bar-icon';
import useAuth from '~/core/auth';
import { PRIMARY } from '~/core/theme/colors';

export default function TabLayout() {
  const { status, user } = useAuth();

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);
  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  if (status === 'idle' || status === 'signOut' || user === null) {
    return <Redirect href={'/welcome'} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: PRIMARY,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="albums" color={color} />,
          tabBarShowLabel: false,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'favorite',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
          tabBarShowLabel: false,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar-clear" color={color} />,
          tabBarShowLabel: false,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
          tabBarShowLabel: false,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
