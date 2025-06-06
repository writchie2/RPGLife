import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
// import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext"; // used for themes, replaces colors import

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
  const colors = useTheme(); // used for themes, replaces colors import

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      // alignItems: "center",
    },
    textLabel: {
      fontFamily: "Alegreya_400Regular",
      fontSize: 18,
      color: colors.textPlaceholder,
    },
    textSelected: {
      fontFamily: "Alegreya_400Regular",
      fontSize: 18,
      color: colors.textInput,
    },
  });

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13);

  const handleConfirm = (date: Date) => {
    setDate(date);
    onDateChange?.(date);
    setShowPicker(false);
  };

  return (
    <View style={style}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setShowPicker(true)}
      >
        {dateSelected && (
          // <Text style={styles.textSelected}>{date.toDateString()}</Text>
          <Text style={styles.textSelected}>
            {date.toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            })}
          </Text>
        )}
        {!dateSelected && <Text style={styles.textLabel}>{label}</Text>}
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={showPicker}
        mode="date"
        //date={maxDate}
        onConfirm={handleConfirm}
        onCancel={() => setShowPicker(false)}
      />
    </View>
  );
};

export default DatePickerComponent;
