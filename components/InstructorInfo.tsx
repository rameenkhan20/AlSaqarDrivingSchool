import { Colors } from '@/constants/colors'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const InstructorInfo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.instructorName}>Bilal Khan</Text>
      <Text>License Type: </Text>
      <Text>License Number: </Text>
      <Text>Vehicle Number: </Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary
    },
    instructorName: {

    }
})


export default InstructorInfo