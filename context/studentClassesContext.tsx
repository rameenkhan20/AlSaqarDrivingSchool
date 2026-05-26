import { createContext, useState } from "react";

interface StudentList {
    id: number;
    studentId: number;
    studentName: string;
    totalClasses: number;
    completedClasses: number;
    scheduledClasses: Date[];
}

const students: StudentList[] = [
  { id: 1, studentId: 101, studentName: 'Ahmed Al Rashid', totalClasses: 20, completedClasses: 12, scheduledClasses: [] },
  { id: 2, studentId: 102, studentName: 'Sara Khalid', totalClasses: 30, completedClasses: 5, scheduledClasses: [] },
  { id: 3, studentId: 103, studentName: 'Mohammed Yusuf', totalClasses: 20, completedClasses: 20, scheduledClasses: [] },
  { id: 4, studentId: 104, studentName: 'Fatima Hassan', totalClasses: 15, completedClasses: 8, scheduledClasses: [] },
  { id: 5, studentId: 105, studentName: 'Omar Siddiqui', totalClasses: 20, completedClasses: 1, scheduledClasses: [] },
  { id: 6, studentId: 106, studentName: 'Layla Abdullah', totalClasses: 20, completedClasses: 12 , scheduledClasses: []},
  { id: 7, studentId: 107, studentName: 'Khalid Mahmood', totalClasses: 30, completedClasses: 5, scheduledClasses: [] },
  { id: 8, studentId: 108, studentName: 'Zainab Mansoor', totalClasses: 20, completedClasses: 20, scheduledClasses: [] },
  { id: 9, studentId: 109, studentName: 'Tariq Anwar', totalClasses: 15, completedClasses: 8, scheduledClasses: [] },
  { id: 10, studentId: 110, studentName: 'Yousef Qureshi', totalClasses: 20, completedClasses: 1, scheduledClasses: [] },
  { id: 11, studentId: 111, studentName: 'Hana Al Farsi', totalClasses: 18, completedClasses: 14 , scheduledClasses: []},
]

//custom Hook
const useClassCount = () => {
    const [studentList , setStudentList] = useState(students);

    function classCountIncrement(studentId: number){
        setStudentList(prev =>
            prev.map(currentStudent => {
                const shouldUpdate = ((currentStudent.studentId === studentId) && (currentStudent.completedClasses < currentStudent.totalClasses))
                return shouldUpdate ?
                {...currentStudent, completedClasses : currentStudent.completedClasses + 1 } :
                currentStudent
            }))
    }

    function scheduledDateTime(studentId: number, dateTime: Date){
        setStudentList(prev => 
            prev.map(student => student.studentId === studentId
                ? {...student, scheduledClasses: [...student.scheduledClasses, dateTime]}
                : student
        )
    )
    }

    return {studentList, classCountIncrement, scheduledDateTime};
}


export const studentClassContext = createContext<{
    studentList: typeof students,
    classCountIncrement: (studentId: number) => void,
    scheduledDateTime: (studentId: number, dateTime: Date) => void} | undefined>(undefined);

export const StudentClassContextProvider = ({children}: any) => {
    const {studentList , classCountIncrement, scheduledDateTime} = useClassCount();

    return <studentClassContext.Provider value={{studentList,classCountIncrement,scheduledDateTime}}>
        {children}
    </studentClassContext.Provider>
} 



