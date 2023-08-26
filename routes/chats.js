import express from "express";
import { Chat } from "../models/chat.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { userId } = req.query;
  const chats = await Chat.find({
    users: { $in: [userId] },
  });
  res.send(chats);
});

router.post("/", async (req, res) => {
  const { userId, friendId } = req.body;

  let chat = await Chat.findOne({ users: [userId, friendId] });

  if (chat) return res.status(400).send("Conversion Already Exist");

  if (userId === friendId)
    return res.status(400).send("Must need two user for create chat");

  chat = new Chat({
    users: [userId, friendId],
  });

  await chat.save();

  res.send(chat);
});

export default router;
