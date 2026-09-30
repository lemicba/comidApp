import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { colors } from '@/constants/theme';

function TabIcon({
  name,
  color,
}: {
  name: ComponentProps<typeof SymbolView>['name'];
  color: ColorValue;
}) {
  return <SymbolView name={name} tintColor={color} size={24} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 78,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Plan',
          tabBarIcon: ({ color }) => (
            <TabIcon
              color={color}
              name={{
                ios: 'calendar',
                android: 'event',
                web: 'calendar_month',
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="casa"
        options={{
          title: 'Casa',
          tabBarIcon: ({ color }) => (
            <TabIcon
              color={color}
              name={{
                ios: 'house',
                android: 'kitchen',
                web: 'kitchen',
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="compras"
        options={{
          title: 'Compras',
          tabBarIcon: ({ color }) => (
            <TabIcon
              color={color}
              name={{
                ios: 'cart',
                android: 'shopping_cart',
                web: 'shopping_basket',
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="hogar"
        options={{
          title: 'Hogar',
          tabBarIcon: ({ color }) => (
            <TabIcon
              color={color}
              name={{
                ios: 'person.3',
                android: 'groups',
                web: 'groups',
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
