const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  validateCreateSubTaskInput,
  validateSubTaskUpdateInput,
} = require("../validator");
const verifyToken = require("../middlewares/verifyToken");
const { StatusSubTask } = require("../models/subtask");
const { Status } = require("../models/task");
const Subtask = mongoose.model("Subtask");
const Task = mongoose.model("Task");

router.post("/api/subtask", verifyToken, (req, res) => {
  const { task_id } = req.body;

  const validation = validateCreateSubTaskInput(task_id);
  if (!validation.success) {
    return res.status(400).json({ error: validation.message });
  }

  const subtask = new Subtask({
    task_id: task_id,
  });

  subtask
    .save()
    .then(async (savedSubTask) => {
      await updateTaskStatus(task_id);
      res.status(201).json(savedSubTask);
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not create subtask" });
    });
});

router.patch("/api/subtask/:subtaskId", verifyToken, async (req, res) => {
  const subtask_id = req.params.subtaskId;
  const { status } = req.body;

  const validation = validateSubTaskUpdateInput(status);
  if (!validation.success) {
    return res.status(400).json({ error: validation.message });
  }

  try {
    const subtask = await Subtask.findById(subtask_id);
    if (!subtask) {
      return res.status(404).json({ error: "Subtask not found" });
    }

    const updateFields = {};
    if (status) {
      updateFields.status = status;
    }

    const updatedSubTask = await Subtask.findByIdAndUpdate(
      subtask_id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedSubTask) {
      return res.status(404).json({ error: "Subtask not found" });
    }

    await updateTaskStatus(subtask.task_id);

    res.status(200).json(updatedSubTask);
  } catch (error) {
    res.status(500).json({ error: "Could not update subtask", error });
  }
});

router.delete("/api/subtask/:subtaskId", verifyToken, async (req, res) => {
  const subtask_id = req.params.subtaskId;

  try {
    const subtask = await Subtask.findById(subtask_id);
    if (!subtask) {
      return res.status(404).json({ error: "Subtask not found" });
    }

    const deletedSubTask = await Subtask.findByIdAndUpdate(
      subtask_id,
      {
        $set: {
          isDeleted: true,
          deleted_at: new Date(),
        },
      },
      { new: true }
    );

    if (!deletedSubTask) {
      return res.status(404).json({ error: "Subtask not found" });
    }

    await updateTaskStatus(subtask.task_id);

    res.status(200).json({
      message: "Subtask soft deleted successfully",
      subtask: deletedSubTask,
    });
  } catch (error) {
    res.status(500).json({ error: "Could not soft delete subtask" });
  }
});

router.get("/api/subtask", verifyToken, async (req, res) => {
  const { task_id, page = 1, limit = 10 } = req.query;

  try {
    const query = {};
    if (task_id) {
      query.task_id = task_id;
    }

    const totalSubTasks = await Subtask.countDocuments(query);

    const subtasks = await Subtask.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Return paginated tasks and total count
    res.json({
      subtasks,
      totalPages: Math.ceil(totalSubTasks / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

async function updateTaskStatus(taskId) {
  const subtasks = await Subtask.find({ task_id: taskId });
  const allSubtasksComplete = subtasks.every(
    (subtask) => subtask.status === StatusSubTask.COMPLETE
  );
  const anySubtaskInProgress = subtasks.some(
    (subtask) => subtask.status === StatusSubTask.COMPLETE
  );

  let newStatus;
  if (allSubtasksComplete) {
    newStatus = Status.DONE;
  } else if (anySubtaskInProgress) {
    newStatus = Status.IN_PROGRESS;
  } else {
    newStatus = Status.TODO;
  }

  await Task.findByIdAndUpdate(taskId, { status: newStatus });
}

module.exports = router;
