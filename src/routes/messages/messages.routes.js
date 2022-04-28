import express from "express";
import {
  addMessage,
  getMessages,
} from "../../controllers/messages/messages.controller.js";
import {
  messageValidation,
  headerValidation,
} from "../../controllers/messages/messages.validator.js";

const router = express.Router();

router.get("/", headerValidation, getMessages);
router.post("/", headerValidation, messageValidation, addMessage);

export default router;
