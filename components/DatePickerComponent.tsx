import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface DatePickerProps {
  style: any;
  label: string;
  dateSelected: Boolean;
  onDateChange?: (date: Date) => void;
}

const DatePickerComponent: React.FC<DatePickerProps> = ({
  style,
  label,
  dateSelected,
  onDateChange,
}) => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  //const [dateSelected, setDateSelected] = useState(false);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      //setDateSelected(true);
      onDateChange?.(selectedDate);
    }
  };

  return (
    <View style={style}>
      {/* Button to Show Date Picker */}
      {!showPicker && (
        <TouchableOpacity
          style={styles.container}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.text}>
            {/* sets look of date */}
            {dateSelected ? date.toDateString() : "Month Day Year"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Date Picker (Only shown when triggered) */}
      {showPicker && (
        <View style={styles.container}>
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            maximumDate={maxDate}
            onChange={handleDateChange}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
  },
  text: {
    // fontSize: 16,
    color: "#39402260",
  },
});

export default DatePickerComponent;
