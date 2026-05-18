
import React from 'react';
import { StyleSheet, Text } from "react-native";
import { Colors } from "../constants/colors";

const BrandName = () => {
  return (
    <Text style={styles.brandName}>Al Saqar Driving School</Text>
  )
}

const styles = StyleSheet.create({
    brandName: {
        fontSize: 18,
        fontWeight: "500",
        textAlign: "center",
        margin: 5,
        color: Colors.primary,
    }
})


export default BrandName
