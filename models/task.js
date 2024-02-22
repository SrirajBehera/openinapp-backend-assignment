const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const Status = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
};

const PriorityTask = {
  PRIORITY_0: 0,
  PRIORITY_1: 1,
  PRIORITY_2: 2,
  PRIORITY_3: 3,
};

const taskSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [Status.TODO, Status.IN_PROGRESS, Status.DONE],
      required: true,
      default: Status.TODO,
    },
    priority: {
      type: Number,
      enum: [
        PriorityTask.PRIORITY_0,
        PriorityTask.PRIORITY_1,
        PriorityTask.PRIORITY_2,
        PriorityTask.PRIORITY_3,
      ],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    due_date: {
      type: Date,
      required: true,
    },
    deleted_at: {
      type: Date,
    },
    created_by: {
      type: Number,
      ref: "User",
      required: true,
    },
  },
  { _id: false },
  {
    // will automatically give a timestamp of createdAt and updatedAt
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

taskSchema.plugin(AutoIncrement, { id: "task_seq", inc_field: "_id" });

mongoose.model("Task", taskSchema);

module.exports = {
  Status,
  PriorityTask,
};
