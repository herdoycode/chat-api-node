import express from "express";
import { Message } from "../models/message.js";
import { Chat } from "../models/chat.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { chatId, sender, content } = req.body;
  const chat = await Chat.findById(chatId);
  const message = new Message({
    chatId,
    sender,
    content,
  });

  chat.latestMessage = content;
  await chat.save();
  await message.save();

  res.send(message);
});

router.get("/", async (req, res) => {
  const { chatId } = req.query;
  const messages = await Message.find({ chatId });
  res.send(messages);
});

export default router;
