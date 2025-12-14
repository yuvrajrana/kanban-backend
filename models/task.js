import mongoose from "mongoose";

const { Schema } = mongoose;

const AssignedToSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    avatarColor: { type: String, required: true },
    email: { type: String, required: false },
    shortName: { type: String, required: false }
  },
  { _id: false }
);

const TaskSchema = new Schema(
  {
    title: { type: String, required: true },
    columnId: { type: String, required: true },
    columnName: { type: String, required: true },
    boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    priority: { type: String, required: true },
    order: { type: Number, required: true },
    assignedTo: { type: AssignedToSchema, required: false },
    description: { type: String },
  },
  { timestamps: true }
);

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
export default Task;
