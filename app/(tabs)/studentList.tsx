import StudentCard from '@/components/StudentCard';
import { Colors } from '@/constants/colors';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { studentClassContext } from '@/context/studentClassesContext';

// const students = [
//   { id: 1, studentId: 101, studentName: 'Ahmed Al Rashid', totalClasses: 20, completedClasses: 12 },
//   { id: 2, studentId: 102, studentName: 'Sara Khalid', totalClasses: 30, completedClasses: 5 },
//   { id: 3, studentId: 103, studentName: 'Mohammed Yusuf', totalClasses: 20, completedClasses: 20 },
//   { id: 4, studentId: 104, studentName: 'Fatima Hassan', totalClasses: 15, completedClasses: 8 },
//   { id: 5, studentId: 105, studentName: 'Omar Siddiqui', totalClasses: 20, completedClasses: 1 },
//   { id: 6, studentId: 106, studentName: 'Layla Abdullah', totalClasses: 20, completedClasses: 12 },
//   { id: 7, studentId: 107, studentName: 'Khalid Mahmood', totalClasses: 30, completedClasses: 5 },
//   { id: 8, studentId: 108, studentName: 'Zainab Mansoor', totalClasses: 20, completedClasses: 20 },
//   { id: 9, studentId: 109, studentName: 'Tariq Anwar', totalClasses: 15, completedClasses: 8 },
//   { id: 10, studentId: 110, studentName: 'Yousef Qureshi', totalClasses: 20, completedClasses: 1 },
//   { id: 11, studentId: 111, studentName: 'Hana Al Farsi', totalClasses: 18, completedClasses: 14 },
// ]


export default function StudentList() {
  const context = useContext(studentClassContext);
  if (!context) throw new Error('No context');
  const { studentList } = context;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={[ 'left', 'right']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 10, paddingTop: 10 }}>
        {studentList.map((student) => (
          <StudentCard
            key={student.id}
            studentId={student.studentId}
            studentName={student.studentName}
            totalClasses={student.totalClasses}
            completedClasses={student.completedClasses}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}