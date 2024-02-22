const { Task, PriorityTask } = require("../models/task");
const cron = require("node-cron");

async function updateTaskPriorities() {
  try {
    const currentDate = new Date();
    const overdueTasks = await Task.find({ due_date: { $lt: currentDate } });

    overdueTasks.forEach(async (task) => {
      const today = new Date();
      const dueDate = new Date(task.due_date);
      const diffTime = Math.abs(dueDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        task.priority = PriorityTask.PRIORITY_0; // Due date is today
      } else if (diffDays <= 2) {
        task.priority = PriorityTask.PRIORITY_1; // Due date is between tomorrow and day after tomorrow
      } else if (diffDays <= 4) {
        task.priority = PriorityTask.PRIORITY_2; // Due date is within 3-4 days
      } else {
        task.priority = PriorityTask.PRIORITY_3; // Due date is 5+ days away
      }

      await task.save();
      console.log(`Priority updated for Task ${task._id}`);
    });
  } catch (error) {
    console.error("Error updating task priorities:", error);
  } finally {
    // Disconnect from MongoDB after updating
    mongoose.disconnect();
  }
}

// cron job to run every day at midnight
cron.schedule("0 0 * * *", () => {
  updateTaskPriorities().then(() => {
    console.log("Task priorities updated successfully.");
  });
});
