import mongoose from "mongoose";

const anony = new mongoose.Schema(
  {
    senderId: {
      type: String,
    },
    senderImg: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Anony = mongoose.model("Anony", anony);
