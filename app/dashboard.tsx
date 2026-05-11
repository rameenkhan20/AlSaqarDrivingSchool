import InstructorInfo from '@/components/InstructorInfo'
import Schedule from '@/components/Schedule'
import React from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function dashboard() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <InstructorInfo />
      <ScrollView style={{flex: 1}}>
        <Schedule
        studentName={'Ahmed Khan'}
        classNumber={3}
        timeSlot={'9:00 - 10:30 AM'}
        />
      </ScrollView>
    </SafeAreaView>
  )
}