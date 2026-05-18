import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function authScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTintColor: Colors.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}>
      <Stack.Screen name="index" options={{
        headerShown: false
      }} />
      <Stack.Screen name="signin" options={{
        headerShown: false
      }} />
      <Stack.Screen name="completeProfile" options={{
        headerShown: true,
        title : "Instructor Profile"
      }} />
    </Stack>
  );
}