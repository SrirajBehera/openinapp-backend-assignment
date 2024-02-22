const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  validateCreateTaskInput,
  validateTaskUpdateInput,
} = require("../validator");
const calculatePriority = require("../utils");
const verifyToken = require("../middlewares/verifyToken");
const moment = require("moment");
const Task = mongoose.model("Task");

router.post("/api/task", verifyToken, (req, res) => {
  const { title, description, due_date } = req.body;

  const validation = validateCreateTaskInput(title, description, due_date);
  if (!validation.success) {
    return res.status(400).json({ error: validation.message });
  }

  const priority = calculatePriority(due_date);
  const parsedDate = moment(due_date, "DD-MM-YYYY").toDate(); // Parse the date string (readable to ISODate)

  const task = new Task({
    title: title,
    description: description,
    priority: priority,
    due_date: parsedDate,
    created_by: req.userId,
  });

  task
    .save()
    .then((savedTask) => {
      res.status(201).json(savedTask);
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not create task" });
    });
});

router.patch("/api/task/:taskId", verifyToken, async (req, res) => {
  const task_id = req.params.taskId;
  const { due_date, status } = req.body;

  const validation = validateTaskUpdateInput(due_date, status);
  if (!validation.success) {
    return res.status(400).json({ error: validation.message });
  }

  try {
    const updateFields = {};
    if (due_date) {
      const parsedDate = moment(due_date, "DD-MM-YYYY").toDate();
      updateFields.due_date = parsedDate;
    }
    if (status) {
      updateFields.status = status;
    }
    const priority = calculatePriority(due_date);
    updateFields.priority = priority;

    const updatedTask = await Task.findByIdAndUpdate(
      task_id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Could not update task" });
  }
});

router.delete("/api/task/:taskId", verifyToken, async (req, res) => {
  const task_id = req.params.taskId;

  try {
    const deletedTask = await Task.findByIdAndUpdate(
      task_id,
      {
        $set: {
          isDeleted: true,
          deleted_at: new Date(),
        },
      },
      { new: true }
    );

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res
      .status(200)
      .json({ message: "Task soft deleted successfully", task: deletedTask });
  } catch (error) {
    res.status(500).json({ error: "Could not soft delete task" });
  }
});

router.get("/api/task", verifyToken, async (req, res) => {
  const { priority, due_date, page = 1, limit = 10 } = req.query;

  try {
    const query = {};
    if (priority) {
      query.priority = priority;
    }
    if (due_date) {
      const parsedDate = moment(due_date, "DD-MM-YYYY").toDate();
      query.due_date = parsedDate;
    }
    query.created_by = req.userId;

    const totalTasks = await Task.countDocuments(query);

    const tasks = await Task.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Return paginated tasks and total count
    res.json({
      tasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
