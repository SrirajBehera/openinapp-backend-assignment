const calculatePriority = (dueDate) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  const dueDateParts = dueDate.split("-");
  const dueDateTime = new Date(
    dueDateParts[2], // year
    dueDateParts[1] - 1, // month
    dueDateParts[0] // day
  );

  const timeDiff = dueDateTime.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (daysDiff === 0) {
    return 0; // Due date is today
  } else if (daysDiff >= 1 && daysDiff <= 2) {
    return 1; // Due date is between tomorrow and day after tomorrow
  } else if (daysDiff >= 3 && daysDiff <= 4) {
    return 2; // Due date is 3-4 days from today
  } else {
    return 3; // Due date is 5+ days from today
  }
}

module.exports = calculatePriority;
