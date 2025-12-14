import mongoose from "mongoose";
const { Schema } = mongoose;

const ColumnSchema = new Schema({
  name: { type: String, required: true },
  wipLimit: {
    type: Number,
    default: 1000,
  },
});

// Board schema
const BoardSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    columns: { type: [ColumnSchema], default: [] },
  },
  { timestamps: true }
);

const Board = mongoose.models.Board || mongoose.model("Board", BoardSchema);
export default Board;
