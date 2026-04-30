import { Colors } from '@/constants/colors';
import Entypo from '@expo/vector-icons/Entypo';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

type props = {
    placeholder : string
}

const PasswordField = ({placeholder} : props) => {
    const [showPassword, setShowPassword] = useState(true);

    function passwordOnPressFunction(){
        setShowPassword((prev) => {
        return !prev
        });
    }

    return (
    <View style={styles.passwordField}>
        <TextInput style={styles.input}
            placeholder={placeholder}
            secureTextEntry={showPassword ? true : false}
        ></TextInput>
        <Pressable onPress={passwordOnPressFunction}>
            {showPassword ? <Entypo name="eye-with-line" size={22} color="black" /> : <Entypo name="eye" size={22} color="black" /> }
        </Pressable>
    </View>
    )
}

const styles = StyleSheet.create({
    passwordField: {
        flexDirection: "row",
        height: 40,
        margin: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.secondary,
        alignItems: "center",
        paddingRight: 10,
      },
      input: {
        flex: 1,
        padding: 9,
      },
})


export default PasswordField



