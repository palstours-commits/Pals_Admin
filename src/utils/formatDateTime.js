export const formatIndianDateTime = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};


export const addDays = (date, days = 0) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return formatIndianDateTime(d);
};