import React, {useState, useContext}  from 'react';

const useDateTimePicker = () => {
    const [step, setStep] = useState<'date' | 'time' | null>(null);
    const [date, setDate] = useState(new Date());

    function openPicker(){setStep('date')}
    function closePicker(){setStep(null)}

    return {step , date, setStep, setDate, openPicker, closePicker}
}

export default useDateTimePicker