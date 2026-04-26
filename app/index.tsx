import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
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
      <Pressable> 
        <Text>Sign Up</Text>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    margin: 20
  },
  input: {
    height: 30,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    margin: 10
  },
  heading: {
    fontSize: 26,
    textAlign: "center",
    margin: 20
  }
})