import Entypo from '@expo/vector-icons/Entypo';
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../constants/colors";
import BrandName from '@/components/BrandName';


export default function Index() {
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  function passwordOnPressFunction(){
    setShowPassword((prev) => {
      return !prev
    });
  }

  function ConfirmPassOnPressFunction(){
    setShowConfirmPassword((prev) => {
      return !prev
    });
  }
  return (
    <View style={styles.container}>
      <BrandName></BrandName>
      <Text style={styles.heading}>Sign Up</Text>
      <TextInput style={styles.usernameInput} 
        placeholder="Username"
      ></TextInput>
      <View style={styles.passwordField}>
      <TextInput style={styles.input}
        placeholder="Password"
        secureTextEntry={showPassword ? true : false}
      ></TextInput>
      <Pressable onPress={passwordOnPressFunction}>
        {showPassword ? <Entypo name="eye-with-line" size={24} color="black" /> : <Entypo name="eye" size={24} color="black" /> }
      </Pressable>
      </View>

      <View style={styles.passwordField} >
      <TextInput style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry={showConfirmPassword ? true : false}
      ></TextInput>
      <Pressable onPress={ConfirmPassOnPressFunction}>
        {showConfirmPassword ? <Entypo name="eye-with-line" size={24} color="black" /> : <Entypo name="eye" size={24} color="black" /> }
      </Pressable>
      </View>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
      <Text style={styles.linkText}>Already have an account? Sign In</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.background,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    margin: 15,
    color: Colors.secondary,
  },
  usernameInput: {
    height: 40,
    padding: 9,
    borderRadius: 10,
    borderWidth: 2,
    margin: 10,
    borderColor: Colors.secondary,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.cream,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    margin: 10,
    backgroundColor: Colors.secondary,
    alignItems: 'center',      // centers text horizontally
    justifyContent: 'center',  // centers text vertically
  },
  linkText: {
    textAlign: "center",
    margin: 10,
    color: Colors.secondary,
    fontWeight: "500",
  },
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