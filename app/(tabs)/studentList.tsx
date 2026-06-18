import StudentCard from '@/components/StudentCard';
import { Colors } from '@/constants/colors';
import { studentClassContext } from '@/context/studentClassesContext';
import { useContext, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StudentList() {
  const [modalVisible, setModalVisible] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentTotalClasses, setnewStudentTotalClasses] = useState("");


  const context = useContext(studentClassContext);
  if (!context) throw new Error('No context');
  const { studentList, addNewStudent } = context;

  const studentsWithPendingClasses = studentList.filter(student => student.completedClasses !== student.totalClasses)
  const studentWithCompletedClasses = studentList.filter(student => student.completedClasses === student.totalClasses)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['left', 'right']}>
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
      <Pressable onPress={() => setModalVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>New Student</Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>New Student</Text>

            <TextInput
              placeholder="Student Name"
              value={newStudentName}
              onChangeText={setNewStudentName}
              style={styles.input}
            />

            <TextInput
              placeholder="Total Classes"
              value={newStudentTotalClasses}
              onChangeText={setnewStudentTotalClasses}
              keyboardType="numeric"
              style={styles.input}
            />

            <Pressable
              style={[styles.modalButton, styles.buttonOpen]}
              onPress={() => {
                addNewStudent(newStudentName, Number(newStudentTotalClasses));
                setNewStudentName("");
                setnewStudentTotalClasses("");
                setModalVisible(false);
              }}>
              <Text style={styles.textStyle}>Save</Text>
            </Pressable>
            <Pressable style={[styles.modalButton, styles.buttonClose]}
            onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  modalButton: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    // margin: 10,
    backgroundColor: Colors.secondary,
    alignItems: 'center',      // centers text horizontally
    justifyContent: 'center', 
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',   // push content to bottom instead of center
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // dim backdrop
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonOpen: {
    backgroundColor: Colors.secondary,
  },
  buttonClose: {
    backgroundColor: Colors.secondary,
  },
  textStyle: {
    fontSize: 16,
    color: Colors.cream,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: "400"
  },
  input: {
    width: '100%',
    height: 42,
    borderWidth: 1,
    borderColor: Colors.steel,
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 5,
    fontSize: 16,
  },
})