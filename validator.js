const moment = require("moment");
const { Priority } = require("./models/user");
const { Status } = require("./models/task");
const { StatusSubTask } = require("./models/subtask");

const validateCreateUserInput = (phoneNumber, priority) => {
  console.log("validateCreateUserInput", phoneNumber, priority);
  if (!phoneNumber || priority) {
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
      message:
        "Invalid priority value. Priority must be one of: HIGH_PRIORITY, MID_PRIORITY, LOW_PRIORITY.",
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

  const parsedDate = moment(due_date, "DD-MM-YYYY").toDate();

  const isValidDate = !isNaN(Date.parse(parsedDate));
  if (!isValidDate) {
    return {
      success: false,
      message: "Due date must be a valid date",
    };
  }

  return { success: true };
};

const validateCreateSubTaskInput = (task_id) => {
  if (!task_id) {
    return { success: false, message: "Task ID is required" };
  }

  if (typeof task_id !== "number" || isNaN(task_id)) {
    return { success: false, message: "Task ID must be a number" };
  }

  return { success: true };
};

const validateTaskUpdateInput = (due_date, status) => {
  if (!moment(due_date, "DD-MM-YYYY", true).isValid()) {
    return {
      success: false,
      message:
        "Invalid due_date format. Please provide a valid date in DD-MM-YYYY format.",
    };
  }

  const validStatuses = [Status.TODO, Status.IN_PROGRESS, Status.DONE];
  if (!validStatuses.includes(status)) {
    return {
      success: false,
      message:
        "Invalid status value. Status must be one of: TODO, IN_PROGRESS, DONE.",
    };
  }

  return { success: true };
};

const validateSubTaskUpdateInput = (status) => {
  if (status === undefined || status === null) {
    return { success: false, message: "Status is required" };
  }

  if (!Object.values(StatusSubTask).includes(status)) {
    return {
      success: false,
      message:
        "Invalid status value. Status must be one of: INCOMPLETE, COMPLETE.",
    };
  }

  return { success: true };
};

module.exports = {
  validateCreateUserInput,
  validateCreateTaskInput,
  validateCreateSubTaskInput,
  validateTaskUpdateInput,
  validateSubTaskUpdateInput,
};
