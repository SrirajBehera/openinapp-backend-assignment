const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const { ObjectId } = mongoose.Schema.Types;

const Status = {
  INCOMPLETE: 0,
  COMPLETE: 1,
};

const subtaskSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    task_id: {
      type: ObjectId,
      ref: "Task",
    },
    status: {
      type: Number,
      enum: [Status.INCOMPLETE, Status.COMPLETE],
      required: true,
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
