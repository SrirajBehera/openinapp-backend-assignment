const Task = require("../models/task");
const { User, Priority } = require("../models/user");
const cron = require("node-cron");

async function simulateVoiceCall(user) {
  try {
    const phoneNumber = user.phone_num;
    console.log(`Simulating call to ${phoneNumber}`);
  } catch (error) {
    console.error("Error simulating voice call:", error);
  }
}

async function makeCallsBasedOnPriority() {
  try {
    const currentDate = new Date();
    const overdueTasks = await Task.find({
      due_date: { $lt: currentDate },
      status: { $ne: "DONE" }, // Only consider tasks that are not done
    }).populate("created_by");

    const tasksByPriority = {};
    overdueTasks.forEach((task) => {
      const priority = task.created_by.priority;
      if (!tasksByPriority[priority]) {
        tasksByPriority[priority] = [];
      }
      tasksByPriority[priority].push(task);
    });

    for (let priority = 0; priority <= Priority.LOW_PRIORITY; priority++) {
      const users = await User.find({ priority });

      for (const user of users) {
        const tasks = tasksByPriority[priority] || [];
        const tasksForUser = tasks.filter(
          (task) => task.created_by._id === user._id
        );
        if (tasksForUser.length > 0) {
          await simulateVoiceCall(user);
          return; // Exit after simulating a call
        }
      }
    }

    console.log("No overdue tasks found for calling.");
  } catch (error) {
    console.error("Error simulating calls based on priority:", error);
  }
}

// cron job to run every hour
cron.schedule("0 * * * *", () => {
  makeCallsBasedOnPriority().then(() => {
    console.log("Voice calls simulated successfully.");
  });
});
