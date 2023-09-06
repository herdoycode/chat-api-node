import express from "express";
import { Anony } from "../models/anony.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { senderId, senderImg, text } = req.body;
  const anony = new Anony({
    senderId,
    senderImg,
    text,
  });
  await anony.save();
  res.send(anony);
});

router.get("/", async (req, res) => {
  const anonys = await Anony.find();
  res.send(anonys);
});

export default router;
