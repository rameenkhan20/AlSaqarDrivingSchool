import InstructorInfo from '@/components/InstructorInfo'
import Schedule from '@/components/Schedule'
import { Colors } from '@/constants/colors'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { withTiming } from 'react-native-reanimated';
import { useSharedValue , Easing, ReduceMotion } from 'react-native-reanimated';



export default function dashboard() {
    const [completedIds, setCompletedIds] = useState<number[]>([]);


    const classes = [
    { id: 1, studentName: 'Ahmed Al Rashid', classNumber: 1, timeSlot: '8:15 - 9:30 AM', sessionCompletion: false },
    { id: 2, studentName: 'Sara Khalid', classNumber: 2, timeSlot: '9:45 - 11:00 AM', sessionCompletion: false },
    { id: 3, studentName: 'Mohammed Yusuf', classNumber: 3, timeSlot: '11:15 - 12:30 PM', sessionCompletion: false },
    { id: 4, studentName: 'Fatima Hassan', classNumber: 4, timeSlot: '12:45 - 2:00 PM', sessionCompletion: false },
    { id: 5, studentName: 'Omar Siddiqui', classNumber: 5, timeSlot: '2:15 - 3:30 PM', sessionCompletion: false },
    { id: 6, studentName: 'Layla Abdullah', classNumber: 6, timeSlot: '3:45 - 5:00 PM', sessionCompletion: false },
    { id: 7, studentName: 'Khalid Mahmood', classNumber: 7, timeSlot: '5:15 - 6:30 PM', sessionCompletion: false },
    ]

    function completedClasses(id : number){
      if (completedIds.includes(id)) return;
      setCompletedIds(prev => [...prev, id]);
    }
    const pendingClasses = classes.filter(item => !completedIds.includes(item.id))

    function animationStyle(){
      const sv = useSharedValue(completedIds);

      withTiming(sv.value, {
      duration: 2000,
      easing: Easing.back(2),
      reduceMotion: ReduceMotion.Never,
    })
    }

  return (
    <SafeAreaView style={{flex: 1 , backgroundColor: Colors.background}} edges={["left","right","top"]} >
      <InstructorInfo />
      {/* <Text style={styles.heading}> Schedule for the day </Text> */}
      <ScrollView style={{flex: 1}}>
        {/* {const pendingClasses = classes.filter(item => !completedIds.includes(item.id))} */}
        {pendingClasses.map((item) => (
            <Schedule
            key={item.id}
            id={item.id}
            studentName={item.studentName}
            timeSlot={item.timeSlot}
            sessionCompletion={item.sessionCompletion}
            onDone={completedClasses}
            />
        ))}
      </ScrollView>
      <View>
        {/* <Pressable style={styles.button}>
            <Text style={styles.buttonText}>My Students</Text>
        </Pressable> */}
        {/* <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Schedule a Class</Text>
        </Pressable> */}
      </View>
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