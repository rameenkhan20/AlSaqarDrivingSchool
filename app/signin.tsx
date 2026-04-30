import BrandName from '@/components/BrandName';
import { View, StyleSheet, Text, TextInput, Pressable } from "react-native";
import {Colors} from "../constants/colors";
import PasswordField from '@/components/PasswordField';

export default function SignIn() {
    return(
        <View style={styles.container}>
            <BrandName/>
            <Text style={styles.heading}>Sign In</Text>
            <TextInput style={styles.usernameInput}
                    placeholder="Username"
            ></TextInput>
            <PasswordField placeholder='Password' />
            <Pressable style={styles.button}>
                    <Text style={styles.buttonText}>Sign In</Text>
            </Pressable>
            <Text style={styles.linkText}>Don't have an account? Register</Text>
        </View>
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
  linkText: {
    textAlign: "center",
    margin: 10,
    color: Colors.secondary,
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