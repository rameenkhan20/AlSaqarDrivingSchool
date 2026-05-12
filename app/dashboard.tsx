import InstructorInfo from '@/components/InstructorInfo'
import Schedule from '@/components/Schedule'
import { Colors } from '@/constants/colors'
import React from 'react'
import { ScrollView, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


export default function dashboard() {
    const classes = [
    { id: 1, studentName: 'Ahmed Al Rashid', classNumber: 1, timeSlot: '8:15 - 9:30 AM' },
    { id: 2, studentName: 'Sara Khalid', classNumber: 2, timeSlot: '9:45 - 11:00 AM' },
    { id: 3, studentName: 'Mohammed Yusuf', classNumber: 3, timeSlot: '11:15 - 12:30 PM' },
    { id: 4, studentName: 'Fatima Hassan', classNumber: 4, timeSlot: '12:45 - 2:00 PM' },
    { id: 5, studentName: 'Omar Siddiqui', classNumber: 5, timeSlot: '2:15 - 3:30 PM' },
    { id: 6, studentName: 'Layla Abdullah', classNumber: 6, timeSlot: '3:45 - 5:00 PM' },
    { id: 7, studentName: 'Khalid Mahmood', classNumber: 7, timeSlot: '5:15 - 6:30 PM' },
    ]

  return (
    <SafeAreaView style={{flex: 1}}>
      <InstructorInfo />
      <Text style={styles.heading}> Schedule for the day </Text>
      <ScrollView style={{flex: 1 , marginTop: 10}}>
        {classes.map((item) => (
            <Schedule
            key={item.id}
            studentName={item.studentName}
            classNumber={item.classNumber}
            timeSlot={item.timeSlot}
            />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    heading: {
        marginTop: 9,
        marginLeft: 15,
        fontWeight: "500",
    }
})