import { Colors } from '@/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>B</Text>
          </View>
          <View>
            <Text style={styles.profileName}>Bilal Khan</Text>
            <Text style={styles.profileSub}>Light Vehicle Instructor</Text>
          </View>
        </View>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.section}>
          <SettingsRow icon="person-outline" label="Edit Profile" />
          <SettingsRow icon="lock-closed-outline" label="Change Password" />
        </View>

        <Text style={styles.sectionTitle}>App</Text>
        <View style={styles.section}>
          <SettingsRow icon="notifications-outline" label="Notifications" />
          <SettingsRow icon="language-outline" label="Language" />
        </View>

        <Pressable style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color={Colors.white} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  )
}

const SettingsRow = ({ icon, label }: { icon: any, label: string }) => (
  <Pressable style={styles.row}>
    <View style={styles.rowLeft}>
      <Ionicons name={icon} size={20} color={Colors.primary} />
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color={Colors.placeholder} />
  </Pressable>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.steel,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.cream,
    fontSize: 24,
    fontWeight: '700',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  profileSub: {
    fontSize: 13,
    color: Colors.placeholder,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.placeholder,
    marginHorizontal: 16,
    marginBottom: 6,
    marginTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  section: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.steel,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.steel,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    fontSize: 15,
    color: Colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    marginHorizontal: 16,
    marginTop: 30,
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
})