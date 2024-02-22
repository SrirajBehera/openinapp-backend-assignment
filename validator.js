const { Priority } = require("./models/user");

const validateCreateUserInput = (phoneNumber, priority) => {
  console.log("validateCreateUserInput", phoneNumber, priority);
  if (!phoneNumber || priority ) {
    return {
      success: false,
      message: "Phone number and priority are required",
    };
  }

  if (phoneNumber.length !== 10) {
    return {
      success: false,
      message: "Phone number must be a string of 10 digits",
    };
  }

  const validPriorities = [
    Priority.HIGH_PRIORITY,
    Priority.MID_PRIORITY,
    Priority.LOW_PRIORITY,
  ];
  if (!validPriorities.includes(priority)) {
    return {
      success: false,
      message: "Invalid priority value",
    };
  }

  return { success: true };
};

const validateCreateTaskInput = (title, description, due_date) => {
  if (!title || !description || !due_date) {
    return {
      success: false,
      message: "Title, description, and due date are required",
    };
  }

  // Additional validation logic for due_date format, etc.

  return { success: true };
};

const validateCreateSubTaskInput = (task_id) => {
  if (!task_id) {
    return { success: false, message: "Task ID is required" };
  }

  // Additional validation logic for task_id format, existence check, etc.

  return { success: true };
};

const validateTaskUpdateInput = (due_date, status) => {
  // Validate due_date format, status values, etc.

  return { success: true };
};

const validateSubTaskUpdateInput = (status) => {
  // Validate status values, etc.

  return { success: true };
};

module.exports = {
  validateCreateUserInput,
  validateCreateTaskInput,
  validateCreateSubTaskInput,
  validateTaskUpdateInput,
  validateSubTaskUpdateInput,
};
