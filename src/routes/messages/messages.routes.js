import express from "express";
import {
  addMessage,
  getMessages,
} from "../../controllers/messages/messages.controller.js";
import messageValidation from "../../controllers/messages/messages.validator.js";

const router = express.Router();

router.get("/", getMessages);
router.post("/", messageValidation, addMessage);

export default router;
