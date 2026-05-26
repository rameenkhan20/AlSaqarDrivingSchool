import StudentCard from '@/components/StudentCard';
import { Colors } from '@/constants/colors';
import { studentClassContext } from '@/context/studentClassesContext';
import { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function StudentList() {
  const context = useContext(studentClassContext);
  if (!context) throw new Error('No context');
  const { studentList } = context;

  const studentsWithPendingClasses = studentList.filter( student => student.completedClasses !== student.totalClasses)
  const studentWithCompletedClasses = studentList.filter( student => student.completedClasses === student.totalClasses)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={[ 'left', 'right']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 10, paddingTop: 10 }}>
        {studentsWithPendingClasses.map((student) => (
          <StudentCard
            key={student.id}
            studentId={student.studentId}
            studentName={student.studentName}
            totalClasses={student.totalClasses}
            completedClasses={student.completedClasses}
            scheduledClasses={student.scheduledClasses}
          />
        ))}
      </ScrollView>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>New Student</Text>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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