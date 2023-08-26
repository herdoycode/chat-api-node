import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    users: {
      type: Array,
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
