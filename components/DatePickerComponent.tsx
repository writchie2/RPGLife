import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface DatePickerProps {
  style: any,
  label: string;
  dateSelected: Boolean,
  onDateChange?: (date: Date) => void;
}

const DatePickerComponent: React.FC<DatePickerProps> = ({ style, label, dateSelected, onDateChange }) => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isDateSelected, setisDateSelected] = useState(false);
  
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13);

    const handleConfirm = (date: Date) => {
      setDate(date);
      setisDateSelected(true);
      onDateChange?.(date);
      setShowPicker(false);
    };

  return (
    <View style={style}>
      <TouchableOpacity style={styles.container} onPress={() => setShowPicker(true)}>
      {isDateSelected &&
        <Text style={styles.textSelected}>
        {date.toDateString()}
        </Text>
      }
      {!isDateSelected &&
        <Text style={styles.textLabel}>
        {label}
        </Text>
      }
      </TouchableOpacity>
      <DateTimePickerModal isVisible={showPicker} mode="date" onConfirm={handleConfirm} onCancel={() => setShowPicker(false)}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLabel: {
    color: '#D3D3D3'
  }, 
  textSelected: {
    color: '#3C4858'
  },
});

export default DatePickerComponent;