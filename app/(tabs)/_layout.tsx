import TabBar from '@/components/TabBar'
import { Tabs } from 'expo-router'
import React from 'react'

const TabLayout = () => {
  return (
    <Tabs tabBar= {props => <TabBar {...props} />} screenOptions={{headerShown : false , animation: "fade"}}>
      <Tabs.Screen name="index" options={{ title: 'Schedule' }} />
      <Tabs.Screen name="studentList" options={{ title: 'Students' }} />
      <Tabs.Screen name="instructorProfile" options={{ title: 'Settings' }} />
    </Tabs>
  )
}

export default TabLayout