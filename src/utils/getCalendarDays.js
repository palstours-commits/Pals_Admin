export function getCalendarDays(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const days = [];

  const startDay = (firstDayOfMonth.getDay() + 6) % 7;

  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ day: d.getDate(), muted: true });
  }

  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    days.push({ day: i, muted: false });
  }

  while (days.length % 7 !== 0) {
    const d = new Date(year, month + 1, days.length);
    days.push({ day: d.getDate(), muted: true });
  }

  return days;
}
