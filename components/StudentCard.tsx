import { Colors } from '@/constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useContext} from 'react';
import { studentClassContext } from '@/context/studentClassesContext';
import useDateTimePicker from '@/hooks/useDateTimePicker';

type studentCardProps = {
    studentId : number;
    studentName: string;
    totalClasses: number;
    completedClasses: number;
    scheduledClasses: Date[];
}


const StudentCard = ({ studentId, studentName, totalClasses, completedClasses, scheduledClasses }: studentCardProps) => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const {step , date, setStep, setDate, openPicker, closePicker} = useDateTimePicker();

    const scheduleContext = useContext(studentClassContext);
    if(!scheduleContext) throw new Error("No context Found")
    const {scheduledDateTime} = scheduleContext;


    function onPressHandler(){
      openPicker()
    }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{studentName.charAt(0)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{studentName}</Text>
        <Text style={styles.subInfo}>Classes Completed: {completedClasses}/{totalClasses}</Text>
      </View>
      <Pressable  onPress={() => onPressHandler()}
        style={styles.button}>
        <Text  style={styles.buttonText}>Schedule</Text>
      </Pressable>
      {step === 'date' &&
      <DateTimePicker
        onChange={(event, selectedDate) => {
          if (event.type === "set" && selectedDate){
            setDate(selectedDate)
            setStep('time')
          }else{
            closePicker()
          }
        }}
        mode="date"
        minimumDate={today}
        maximumDate={thirtyDaysFromNow}
        value={date}
      />}
      {step === 'time' &&
      <DateTimePicker
        value={date}
        onChange={(event, selectedDate) => {
          if (selectedDate){
            setDate(selectedDate)
            console.log(selectedDate.toString())
            scheduledDateTime(studentId,selectedDate);
            closePicker()
          }
        }}
        mode="time"
      />
      }
    </View>
  )
}

export default StudentCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.steel,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: Colors.cream,
    fontSize: 20,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  subInfo: {
    fontSize: 13,
    color: Colors.placeholder,
    fontWeight: "500",
  },
  button: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.cream,
    fontSize: 13,
    fontWeight: '500',
  }
})