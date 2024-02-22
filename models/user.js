const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const Priority = {
  HIGH_PRIORITY: 0,
  MID_PRIORITY: 1,
  LOW_PRIORITY: 2,
};

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    phone_num: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      enum: [
        Priority.HIGH_PRIORITY,
        Priority.MID_PRIORITY,
        Priority.LOW_PRIORITY,
      ],
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

userSchema.plugin(AutoIncrement, { id: "user_seq", inc_field: "_id" });

mongoose.model("User", userSchema);

module.exports = {
  Priority,
};
