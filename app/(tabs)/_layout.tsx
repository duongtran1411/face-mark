import { Tabs } from 'expo-router';
import React from 'react';
import { View, Image } from 'react-native';
import CustomHeader from '@/components/CustomHeader';

const tabBackgroundColor = '#297339'; // Orange color from image
const activeIconBackgroundColor = '#FFFFFF';
const activeIconColor = tabBackgroundColor;
const inactiveIconColor = '#FFFFFF';

const CustomTabBarIcon = ({ iconSource, color, focused }: { iconSource: any; color: string; focused: boolean }) => (
  <View style={{
    width: focused ? 55 : 'auto', 
    height: focused ? 55 : 'auto', 
    borderRadius: focused ? 30 : 0, 
    backgroundColor: focused ? activeIconBackgroundColor : 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    // Add some elevation for the focused icon
    elevation: focused ? 5 : 0,
    shadowColor: focused ? '#000' : 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  }}>
    <Image
      source={iconSource}
      style={{ width: 28, height: 28, tintColor: focused ? activeIconColor : color }}
      resizeMode="contain"
    />
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <CustomHeader />,
        tabBarShowLabel: false,
        tabBarInactiveTintColor: inactiveIconColor,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 40,
          right: 40,
          backgroundColor: tabBackgroundColor,
          borderRadius: 35,
          height: 70,
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarIcon 
              iconSource={require('../../assets/images/home.png')} 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <CustomTabBarIcon 
              iconSource={require('../../assets/images/user.png')} 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="CalendarScreen"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="ClassDetailScreen"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
