import { Colors } from '@/constants/colors'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const InstructorInfo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.instructorName}>Bilal Khan</Text>
      <Text style={styles.subInfo}>License Type: Light Vehicle</Text>
      <Text style={styles.subInfo}>License Number: 5879-xxxx-xxxx</Text>
      <Text style={styles.subInfo}>Vehicle Number: MNP2015 </Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    instructorName: {
        color: Colors.white,
        fontSize: 25,
        marginBottom: 2,
    },
    subInfo: {
        color: Colors.steel,
        fontSize: 14,
        marginBottom: 3,
    }
})


export default InstructorInfo