import { Colors } from '@/constants/colors';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';


type Props = {
    studentName : string;
    classNumber : number;
    timeSlot : string;
}

const Schedule = ({studentName, classNumber, timeSlot}: Props) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
        <Text style={styles.studentName}>{studentName || "Student Name"}</Text>
        <Text style={styles.subInfo}>Class Number : {classNumber || ""} </Text>
        <Text style={styles.subInfo}>Time Slot : {timeSlot || ""} </Text>
        <View style={styles.cardFooter}>
            {/* <Text style={{fontSize: 8, fontWeight: "400", color: Colors.text}}>Session Completed:</Text> */}
            <Switch
            trackColor={{false: Colors.steel , true: Colors.primary}}
            thumbColor={isEnabled ? Colors.accent : Colors.primary}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
            />
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Modify</Text>
            </Pressable>
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
        padding: 10,
        borderColor: Colors.steel,
        backgroundColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 9,
        elevation: 4,
    },
    studentName: {
        color: Colors.text,
        // paddingHorizontal: 2,
        marginVertical: 1,
        fontSize: 19,
        fontWeight: "400",
        paddingLeft:6,
    },
    subInfo: {
        color: Colors.text,
        fontSize: 16,
        // paddingHorizontal: 2,
        marginVertical: 1.5,
        fontWeight: "400",
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
    button: {
        width: 90,
        borderRadius: 10,
        backgroundColor: Colors.accent,
        alignItems: 'center',      // centers text horizontally
        justifyContent: 'center',  // centers text vertically
    },
    buttonText: {
        color: Colors.cream,
        padding: 8,
    }
})


export default Schedule