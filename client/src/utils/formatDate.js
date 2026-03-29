export const formatDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Example: 29 Mar 2026, 10:30 AM