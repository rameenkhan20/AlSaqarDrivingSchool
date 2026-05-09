import InstructorInfo from '@/components/InstructorInfo'
import Schedule from '@/components/Schedule'
import React from 'react'
import { View } from 'react-native'

export default function dashboard() {
  return (
    <View>
      <InstructorInfo />
      <Schedule/>
    </View>
  )
}