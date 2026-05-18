import { Colors } from '@/constants/colors';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CompleteProfile() {
  const [fullName, setFullName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseType, setLicenseType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={["left","right"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>We need a few details to get you started</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Bilal Khan"
            placeholderTextColor={Colors.placeholder}
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>License Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 5879-xxxx-xxxx"
            placeholderTextColor={Colors.placeholder}
            value={licenseNumber}
            onChangeText={setLicenseNumber}
          />

          <Text style={styles.label}>License Type</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Light Vehicle, Heavy Vehicle"
            placeholderTextColor={Colors.placeholder}
            value={licenseType}
            onChangeText={setLicenseType}
          />

          <Text style={styles.label}>Vehicle Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. MNP2015"
            placeholderTextColor={Colors.placeholder}
            value={vehicleNumber}
            onChangeText={setVehicleNumber}
          />
        </View>

        <Pressable
          style={styles.button}
          onPress={() => router.replace('/(tabs)' as any)}
        >
          <Text style={styles.buttonText}>Save & Continue</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginTop: 40,
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.placeholder,
  },
  form: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.steel,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 36,
  },
  buttonText: {
    color: Colors.cream,
    fontSize: 16,
    fontWeight: '600',
  },
})