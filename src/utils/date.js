export const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const formatDateInput = (date) => {
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
};
