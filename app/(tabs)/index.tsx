import InstructorInfo from '@/components/InstructorInfo'
import Schedule from '@/components/Schedule'
import { Colors } from '@/constants/colors'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, View, FlatList } from 'react-native'
import Animated, { CurvedTransition, LinearTransition, SlideOutLeft, FadeOutLeft } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { studentClassContext } from '@/context/studentClassesContext'
import { useContext } from 'react'

export default function dashboard() {
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  const context = useContext(studentClassContext);
  if (!context) throw new Error('No context');
  const { studentList, classCountIncrement } = context;

  const classes = [
    { id: 1, studentId: 101, studentName: 'Ahmed Al Rashid', classNumber: 1, timeSlot: '8:15 - 9:30 AM', sessionCompletion: false },
    { id: 2, studentId: 102, studentName: 'Sara Khalid', classNumber: 2, timeSlot: '9:45 - 11:00 AM', sessionCompletion: false },
    { id: 3, studentId: 103, studentName: 'Mohammed Yusuf', classNumber: 3, timeSlot: '11:15 - 12:30 PM', sessionCompletion: false },
    { id: 4, studentId: 104, studentName: 'Fatima Hassan', classNumber: 4, timeSlot: '12:45 - 2:00 PM', sessionCompletion: false },
    { id: 5, studentId: 105, studentName: 'Omar Siddiqui', classNumber: 5, timeSlot: '2:15 - 3:30 PM', sessionCompletion: false },
    { id: 6, studentId: 106, studentName: 'Layla Abdullah', classNumber: 6, timeSlot: '3:45 - 5:00 PM', sessionCompletion: false },
    { id: 7, studentId: 107, studentName: 'Khalid Mahmood', classNumber: 7, timeSlot: '5:15 - 6:30 PM', sessionCompletion: false },
    { id: 8, studentId: 108, studentName: 'Zainab Mansoor', classNumber: 3, timeSlot: '11:15 - 12:30 PM', sessionCompletion: false },
    { id: 9, studentId: 109, studentName: 'Tariq Anwar', classNumber: 4, timeSlot: '12:45 - 2:00 PM', sessionCompletion: false },
    { id: 10, studentId: 110, studentName: 'Yousef Qureshi', classNumber: 5, timeSlot: '2:15 - 3:30 PM', sessionCompletion: false },
    { id: 11, studentId: 111, studentName: 'Hana Al Farsi', classNumber: 6, timeSlot: '3:45 - 5:00 PM', sessionCompletion: false },
  ]

  function completedClasses(id: number, studentId: number) {
    if (completedIds.includes(id)) return;
    classCountIncrement(studentId);
    setTimeout(() => {
      setCompletedIds(prev => [...prev, id]);
    },300);
  }
  const pendingClasses = classes.filter(item => !completedIds.includes(item.id))


  // function classIncrement(count: number){
  //   count += 1
  // }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={["left", "right", "top"]} >
      <InstructorInfo />
      {/* <FlatList
        data={pendingClasses}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 10 }}
        renderItem={({ item }) => (
          <Animated.View
            exiting={SlideOutLeft.duration(500)}
            layout={LinearTransition.delay(1000)}
          >
            <Schedule
              id={item.id}
              studentName={item.studentName}
              timeSlot={item.timeSlot}
              sessionCompletion={item.sessionCompletion}
              onDone={completedClasses}
            />
          </Animated.View>
        )}
      /> */}

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        {pendingClasses.map((item) => (
          <Animated.View key={item.id} exiting={SlideOutLeft.duration(300)} layout={LinearTransition.delay(300)} >
            <Schedule
              id={item.id}
              studentId={item.studentId}
              studentName={item.studentName}
              timeSlot={item.timeSlot}
              sessionCompletion={item.sessionCompletion}
              onDone={completedClasses}
            />
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    marginTop: 9,
    marginLeft: 15,
    fontWeight: "500",
  },
  // buttonText: {
  // fontSize: 16,
  // fontWeight: "500",
  // color: Colors.white,
  // },
  // button: {
  //     padding: 9,
  //     borderRadius: 12,
  //     marginVertical: 3,
  //     marginHorizontal: 20,
  //     backgroundColor: Colors.secondary,
  //     alignItems: 'center',      // centers text horizontally
  //     justifyContent: 'center',  // centers text vertically
  // },
})