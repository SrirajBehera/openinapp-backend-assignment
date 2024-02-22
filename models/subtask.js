const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const StatusSubTask = {
  INCOMPLETE: 0,
  COMPLETE: 1,
};

const subtaskSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    task_id: {
      type: Number,
      ref: "Task",
    },
    status: {
      type: Number,
      enum: [StatusSubTask.INCOMPLETE, StatusSubTask.COMPLETE],
      required: true,
      default: StatusSubTask.INCOMPLETE,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    deleted_at: {
      type: Date,
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

subtaskSchema.plugin(AutoIncrement, { id: "subtask_seq", inc_field: "_id" });

mongoose.model("Subtask", subtaskSchema);
module.exports = {
  StatusSubTask,
};
