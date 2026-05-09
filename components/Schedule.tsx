import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button } from '@react-navigation/elements'
import { Colors } from '@/constants/colors'

const Schedule = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.studentName}>Student Name</Text>
        <Text>Class Number: </Text>
        <Text>Time Slot: </Text>
        <Button>Modify</Button>
    </View>
  )
}

export default Schedule

const styles = StyleSheet.create({
    container: {
        margin: 20,
        borderRadius: 8,
        borderWidth: 2,
        padding: 10,
        borderColor: Colors.steel,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    studentName: {
        color: Colors.text,
        fontSize: 20,
        margin: 3,
    },
    subInfo: {
        color: Colors.text,
        fontSize: 14,
        margin: 4,
    },
})