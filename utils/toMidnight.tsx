export function toMidnight(date: Date) {
    if (!date) return date;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }