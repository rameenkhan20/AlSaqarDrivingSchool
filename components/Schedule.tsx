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
        <Text style={styles.studentName}>Student Name</Text>
        <Text style={styles.subInfo}>Class Number : </Text>
        <Text style={styles.subInfo}>Time Slot : </Text>
        <View style={styles.cardFooter}>
            <Switch
            trackColor={{false: Colors.steel , true: Colors.primary}}
            thumbColor={isEnabled ? Colors.accent : Colors.primary}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
            />
            <Pressable style={styles.button} >
                <Text style={styles.buttonText}>Modify</Text>
            </Pressable>
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
        marginHorizontal: 18,
        marginVertical: 15,
        borderRadius: 12,
        borderWidth: 1,
        padding: 10,
        borderColor: Colors.steel,
        backgroundColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    studentName: {
        color: Colors.text,
        paddingHorizontal: 2,
        marginVertical: 2,
        fontSize: 18,
    },
    subInfo: {
        color: Colors.text,
        fontSize: 15,
        paddingHorizontal: 2,
        marginVertical: 2,
    },
    cardFooter: {
        marginVertical: 3,
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