import express from "express";
import {
  addMessage,
  deleteMessage,
  getMessages,
  updateMessage,
} from "../../controllers/messages/messages.controller.js";
import {
  validateMessage,
  validadeMessageExistence,
} from "../../controllers/messages/messages.validator.js";
import headerValidation from "../../utils/headerValidation.js";

const router = express.Router();

router.get("/", headerValidation, getMessages);
router.post("/", headerValidation, validateMessage, addMessage);

router.put(
  "/:messageId",
  headerValidation,
  validateMessage,
  validadeMessageExistence,
  updateMessage
);

router.delete(
  "/:messageId",
  headerValidation,
  validadeMessageExistence,
  deleteMessage
);

export default router;
