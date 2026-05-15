import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function studentList() {
  return (
    <View style={styles.container}>
      <Text>studentList</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});