import BrandName from '@/components/BrandName';
import PasswordField from '@/components/PasswordField';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "../../constants/colors";


export default function SignUp() {
  return (
    <SafeAreaView style={styles.container}>
      <BrandName/>
      <Text style={styles.heading}>Sign Up</Text>
      <TextInput style={styles.usernameInput}
        placeholder="Username"
      ></TextInput>
      <PasswordField placeholder='Password'/>
      <PasswordField placeholder='Confirm Password'/>
      <Pressable onPress={() => router.replace("/(auth)/signin")} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
      <Text
        style={styles.linkText}>
        Already have an account? Sign In
        </Text>
    </SafeAreaView>
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
    color: Colors.primary,
    fontWeight: "500",
  }
})