import StudentCard from '@/components/StudentCard';
import { Colors } from '@/constants/colors';
import { studentClassContext } from '@/context/studentClassesContext';
import { useContext } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function StudentList() {
  // const [classLimit, setClassLimit] = useState({
  //   totalClasses: 20,
  //   completedClasses: 0
  // });

  // function classLimitConditional(){
  //   setClassLimit(prev => {
  //     if(prev.completedClasses <= prev.totalClasses){
  //       return 
  //     }
  //   })}

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
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}