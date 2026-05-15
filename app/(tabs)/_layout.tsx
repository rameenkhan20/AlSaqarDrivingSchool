import { Tabs } from 'expo-router'
import React from 'react'
import TabBar from '@/components/TabBar'

const TabLayout = () => {
  return (
    <Tabs tabBar= {props => <TabBar {...props} />} screenOptions={{headerShown : false}}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="instructorProfile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="studentList" options={{ title: 'Students' }} />
    </Tabs>
  )
}

export default TabLayout