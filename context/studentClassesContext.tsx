import { Children, createContext, useState } from "react";

const students = [
  { id: 1, studentId: 101, studentName: 'Ahmed Al Rashid', totalClasses: 20, completedClasses: 12 },
  { id: 2, studentId: 102, studentName: 'Sara Khalid', totalClasses: 30, completedClasses: 5 },
  { id: 3, studentId: 103, studentName: 'Mohammed Yusuf', totalClasses: 20, completedClasses: 20 },
  { id: 4, studentId: 104, studentName: 'Fatima Hassan', totalClasses: 15, completedClasses: 8 },
  { id: 5, studentId: 105, studentName: 'Omar Siddiqui', totalClasses: 20, completedClasses: 1 },
  { id: 6, studentId: 106, studentName: 'Layla Abdullah', totalClasses: 20, completedClasses: 12 },
  { id: 7, studentId: 107, studentName: 'Khalid Mahmood', totalClasses: 30, completedClasses: 5 },
  { id: 8, studentId: 108, studentName: 'Zainab Mansoor', totalClasses: 20, completedClasses: 20 },
  { id: 9, studentId: 109, studentName: 'Tariq Anwar', totalClasses: 15, completedClasses: 8 },
  { id: 10, studentId: 110, studentName: 'Yousef Qureshi', totalClasses: 20, completedClasses: 1 },
  { id: 11, studentId: 111, studentName: 'Hana Al Farsi', totalClasses: 18, completedClasses: 14 },
]

//custom Hook
const useClassCount = () => {
    const [studentList , setStudentList] = useState(students);

    function classCountIncrement(studentId: number){
        setStudentList(prev =>
            prev.map(currentStudent =>
                (currentStudent.studentId === studentId) ?
                {...currentStudent, completedClasses : currentStudent.completedClasses + 1 } :
                currentStudent
            )
        )
    }
    return {studentList, classCountIncrement};
}


export const studentClassContext = createContext<{
    studentList: typeof students,
    classCountIncrement: (studentId: number) => void } | undefined>(undefined);

export const StudentClassContextProvider = ({children}: any) => {
    const {studentList , classCountIncrement} = useClassCount();

    return <studentClassContext.Provider value={{studentList,classCountIncrement}}>
        {children}
    </studentClassContext.Provider>
} 



