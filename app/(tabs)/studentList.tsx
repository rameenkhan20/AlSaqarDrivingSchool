import StudentCard from '@/components/StudentCard';
import { Colors } from '@/constants/colors';
import { ScrollView , Text} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const students = [
  { id: 1, studentName: 'Ahmed Al Rashid', totalClasses: 20, completedClasses: 12 },
  { id: 2, studentName: 'Sara Khalid', totalClasses: 30, completedClasses: 5 },
  { id: 3, studentName: 'Mohammed Yusuf', totalClasses: 20, completedClasses: 20 },
  { id: 4, studentName: 'Fatima Hassan', totalClasses: 15, completedClasses: 8 },
  { id: 5, studentName: 'Omar Siddiqui', totalClasses: 20, completedClasses: 1 },
  { id: 6, studentName: 'Ahmed Al Rashid', totalClasses: 20, completedClasses: 12 },
  { id: 7, studentName: 'Sara Khalid', totalClasses: 30, completedClasses: 5 },
  { id: 8, studentName: 'Mohammed Yusuf', totalClasses: 20, completedClasses: 20 },
  { id: 9, studentName: 'Fatima Hassan', totalClasses: 15, completedClasses: 8 },
  { id: 10, studentName: 'Omar Siddiqui', totalClasses: 20, completedClasses: 1 },
]

export default function StudentList() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top', 'left', 'right']}>
      <Text>Students</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 10, paddingTop: 10 }}>
        {students.map((student) => (
          <StudentCard
            key={student.id}
            studentName={student.studentName}
            totalClasses={student.totalClasses}
            completedClasses={student.completedClasses}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}