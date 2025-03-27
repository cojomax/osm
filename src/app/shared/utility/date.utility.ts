/** Extract just the date part of a given Date object in ISO format. */
export function getIsoDate(date: Date | null) {
  return date?.toISOString().split('T')[0];
}

/** Extract time (HH:mm) part of a given Date object in ISO format. */
export function getIsoTime(date: Date | null) {
  if (!date) {
    return null;
  }
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${hour}:${minute}`;
}
