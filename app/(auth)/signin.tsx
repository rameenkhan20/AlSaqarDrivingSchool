import BrandName from '@/components/BrandName';
import PasswordField from '@/components/PasswordField';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "../../constants/colors";
import {RelativePathString } from 'expo-router';

export default function SignIn() {
    return(
        <SafeAreaView style={styles.container}>
            <BrandName/>
            <Text style={styles.heading}>Sign In</Text>
            <TextInput style={styles.usernameInput}
                    placeholder="Username"
            ></TextInput>
            <PasswordField placeholder='Password' />
            <Pressable onPress={() => router.replace("/(auth)/completeProfile")} style={styles.button}>
                    <Text style={styles.buttonText}>Sign In</Text>
            </Pressable>
            <Text
            
            style={styles.linkText}>
            Don't have an account? Register
            </Text>
        </SafeAreaView>
    )
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
    color: Colors.primary,
    },
    usernameInput: {
    height: 40,
    padding: 9,
    borderRadius: 10,
    borderWidth: 2,
    margin: 10,
    backgroundColor: Colors.white,
    borderColor: Colors.secondary,
  },
  linkText: {
    textAlign: "center",
    margin: 10,
    color: Colors.primary,
    fontWeight: "500",
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
})