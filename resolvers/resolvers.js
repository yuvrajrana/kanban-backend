import Task from "../models/task.js";
import Board from "../models/board.js";
import User from "../models/user.js";
import mongoose from "mongoose";

export const resolvers = {
  Query: {
    boards: async () => Board.find().exec(),
    board: async (_parent, { id }) => Board.findById(id).exec(),
    users: async () => User.find().exec(),
    user: async (_parent, { id }) => User.findById(id).exec(),
  },

  Board: {
    tasks: async (parent) => {
      const tasks = await Task.find({ boardId: parent._id }).sort("order").exec();
      return tasks.map((task) => ({
        ...task.toObject(),
        column: { name: task.columnName },
      }));
    },
  },

  Task: {
    assignedTo: async (parent) => User.findById(parent.assignedTo._id).exec(),
    board: async (parent) => Board.findById(parent.boardId).exec(),
    column: async (parent) => ({ name: parent.columnName }),
  },

  User: {
    boards: async (parent) => Board.find({ _id: { $in: parent.boards } }).exec(),
  },

  Mutation: {
    createBoard: async (_, { name, description, columns }) => {
      if (!name || !columns || columns.length === 0) {
        throw new Error("Board name and at least one column are required");
      }

      const normalizedColumns = columns.map((col) => ({
        name: col.name,
        wipLimit: col.wipLimit ?? 1000,
      }));

      const newBoard = new Board({
        name,
        description,
        columns: normalizedColumns,
      });

      return await newBoard.save();
    },


    updateTaskColumn: async (_, { taskId, columnName, order }) => {
      const objectId = new mongoose.Types.ObjectId(taskId);


      const updatedTask = await Task.findByIdAndUpdate(
        objectId,
        { columnName, ...(order !== undefined ? { order } : {}) },
        { new: true }
      );

      if (!updatedTask) throw new Error("Task not found");


      if (order !== undefined) {
        const tasksInColumn = await Task.find({
          columnName,
          boardId: updatedTask.boardId,
          _id: { $ne: objectId },
        }).sort("order");

        for (let t of tasksInColumn) {
          if (t.order >= order) {
            t.order += 1;
            await t.save();
          }
        }
      }

      return updatedTask;
    },

    createTask: async (
      _,
      { title, columnName, boardId, priority, order, userId, columnId }
    ) => {

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Assigned user not found");
      }


      const lastTask = await Task.findOne({ columnId, boardId })
        .sort({ order: -1 })
        .select("order");

      const nextOrder =
        order !== undefined
          ? order
          : lastTask
            ? lastTask.order + 1
            : 0;

      const newTask = new Task({
        title,
        assignedTo: user,
        columnName,
        boardId,
        priority,
        order: nextOrder,
        columnId
      });

      return await newTask.save();
    },



  },
};
