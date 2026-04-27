import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../constants/colors";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.brandName}>Al Saqar Driving School</Text>
      <Text style={styles.heading}>Sign Up</Text>
      <TextInput style={styles.input}
        placeholder="Username"
      ></TextInput>
      <TextInput style={styles.input}
        placeholder="Password"
      ></TextInput>
      <TextInput style={styles.input}
        placeholder="Confirm Password"
      ></TextInput>
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
    margin: 20,
    backgroundColor: Colors.background,
    marginBottom: 20,
  },
  brandName: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    margin: 5,
    color: Colors.secondary,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    margin: 15,
    color: Colors.secondary,
  },
  input: {
    height: 40,
    padding: 14,
    borderWidth: 1,
    borderRadius: 10,
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
  }
})