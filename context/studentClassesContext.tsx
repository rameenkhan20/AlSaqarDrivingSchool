import { createContext, useState } from "react";

interface StudentList {
    id: number;
    studentId: number;
    studentName: string;
    totalClasses: number;
    completedClasses: number;
    scheduledClasses: Date[];
    sessionCompletion: boolean;
}

const students: StudentList[] = [
  { id: 1, studentId: 101, studentName: 'Ahmed Al Rashid', totalClasses: 20, completedClasses: 12, scheduledClasses: [], sessionCompletion: false },
  { id: 2, studentId: 102, studentName: 'Sara Khalid', totalClasses: 30, completedClasses: 5, scheduledClasses: [], sessionCompletion: false },
  { id: 3, studentId: 103, studentName: 'Mohammed Yusuf', totalClasses: 20, completedClasses: 20, scheduledClasses: [], sessionCompletion: false },
  { id: 4, studentId: 104, studentName: 'Fatima Hassan', totalClasses: 15, completedClasses: 8, scheduledClasses: [], sessionCompletion: false },
  { id: 5, studentId: 105, studentName: 'Omar Siddiqui', totalClasses: 20, completedClasses: 1, scheduledClasses: [], sessionCompletion: false },
  { id: 6, studentId: 106, studentName: 'Layla Abdullah', totalClasses: 20, completedClasses: 12 , scheduledClasses: [], sessionCompletion: false},
  { id: 7, studentId: 107, studentName: 'Khalid Mahmood', totalClasses: 30, completedClasses: 5, scheduledClasses: [], sessionCompletion: false },
  { id: 8, studentId: 108, studentName: 'Zainab Mansoor', totalClasses: 20, completedClasses: 20, scheduledClasses: [], sessionCompletion: false },
  { id: 9, studentId: 109, studentName: 'Tariq Anwar', totalClasses: 15, completedClasses: 8, scheduledClasses: [] , sessionCompletion: false},
  { id: 10, studentId: 110, studentName: 'Yousef Qureshi', totalClasses: 20, completedClasses: 1, scheduledClasses: [], sessionCompletion: false },
  { id: 11, studentId: 111, studentName: 'Hana Al Farsi', totalClasses: 18, completedClasses: 14 , scheduledClasses: [], sessionCompletion: false},
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
    )}

    function modifyScheduledClass(studentId: number, modifiedDateTime: Date){
        setStudentList(prev =>
            prev.map(student => student.studentId === studentId
                ? {...student, scheduledClasses: [modifiedDateTime]}
                : student
        ))
    }

    function addNewStudent(studentName: string , totalClasses: number){
        const existingIds = studentList.map(student => student.id)
        const largestId = Math.max(...existingIds)
        const newStudentId = largestId + 1 

        const newStudent = {
            id: newStudentId,
            studentId: newStudentId,
            studentName: studentName,
            totalClasses: totalClasses,
            completedClasses: 0,
            scheduledClasses: [],
            sessionCompletion: false,
        }

        setStudentList(prev => [...prev , newStudent])

    }

    return {studentList, classCountIncrement, scheduledDateTime, modifyScheduledClass, addNewStudent};
}
    
export const studentClassContext = createContext<{
    studentList: typeof students,
    classCountIncrement: (studentId: number) => void,
    scheduledDateTime: (studentId: number, dateTime: Date) => void
    modifyScheduledClass: (studentId: number, modifiedDateTime: Date) => void
    addNewStudent: (studentName: string , totalClasses: number) => void} | undefined>(undefined);

export const StudentClassContextProvider = ({children}: any) => {
    const {studentList , classCountIncrement, scheduledDateTime, modifyScheduledClass, addNewStudent} = useClassCount();

    return <studentClassContext.Provider value={{studentList,classCountIncrement,scheduledDateTime,modifyScheduledClass,addNewStudent}}>
        {children}
    </studentClassContext.Provider>
}



