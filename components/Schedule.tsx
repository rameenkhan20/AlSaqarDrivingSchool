import { Colors } from '@/constants/colors';
import React , { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';



type Props = {
    studentName : string;
    timeSlot : string;
}

const Schedule = ({studentName, timeSlot}: Props) => {
    // const classes = [
    //     { id: 1, studentName: 'Ahmed Al Rashid', classNumber: 1, timeSlot: '8:15 - 9:30 AM' },
    //     { id: 2, studentName: 'Sara Khalid', classNumber: 2, timeSlot: '9:45 - 11:00 AM' },
    //     { id: 3, studentName: 'Mohammed Yusuf', classNumber: 3, timeSlot: '11:15 - 12:30 PM' },
    //     { id: 4, studentName: 'Fatima Hassan', classNumber: 4, timeSlot: '12:45 - 2:00 PM' },
    //     { id: 5, studentName: 'Omar Siddiqui', classNumber: 5, timeSlot: '2:15 - 3:30 PM' },
    //     { id: 6, studentName: 'Layla Abdullah', classNumber: 6, timeSlot: '3:45 - 5:00 PM' },
    //     { id: 7, studentName: 'Khalid Mahmood', classNumber: 7, timeSlot: '5:15 - 6:30 PM' },
    // ]

    // const [sessionCompleted , setSessionCompleted] = useState(false);

    // function onSessionCompletion(prev : boolean){
    //     const myTimeout = setTimeout(() => {
    //         classes.find(index )
    //         classes.filter()
    //     }, 1000);
    //     return !prev;
    // }

  return (
    <View style={styles.container}>
        <View style={styles.flexRow}>
            <View style={styles.flexCol}>
                <Text style={styles.studentName}>{studentName || "Student Name"}</Text>
                {/* <Text style={styles.subInfo}>Class Number : {classNumber || ""} </Text> */}
                <Text style={styles.subInfo}>Time Slot : {timeSlot || ""} </Text>
            </View>
            <View style={[styles.flexCol , {gap: 4}]}>
                <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>Done</Text>
                </Pressable>
                <Pressable style={styles.button}>
                    <Text style={styles.buttonText}>Modify</Text>
                </Pressable>
            </View>
        </View>

    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        padding: 11,
        borderColor: Colors.steel,
        backgroundColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 9,
        elevation: 4,
        // flex: 1,
        // flexDirection: "column",
        // justifyContent: "space-between",
        // alignItems: "center",
    },
    studentName: {
        color: Colors.text,
        // paddingHorizontal: 2,
        marginVertical: 1,
        fontSize: 19,
        fontWeight: "500",
        paddingLeft:6,
    },
    subInfo: {
        color: Colors.text,
        fontSize: 15,
        // paddingHorizontal: 2,
        marginVertical: 1.5,
        fontWeight: "semibold",
        paddingLeft:6,
    },
    cardFooter: {
        marginVertical: 3,
        marginHorizontal: 6,
        flex: 2,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    flexRow : {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    flexCol: {
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "space-between"
    },
    // cardFooter2 : {
    //     flex: 2,
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    //     alignItems: "center",
    // },
    button: {
        width: 90,
        borderRadius: 10,
        height: 35,
        backgroundColor: Colors.secondary,
        alignItems: 'center',      // centers text horizontally
        justifyContent: 'center',  // centers text vertically
    },
    buttonText: {
        color: Colors.cream,
        padding: 8,
    }
})


export default Schedule