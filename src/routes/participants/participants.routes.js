import express from "express";
import participantValidation from "../../controllers/participants/participant.validator.js";
import {
  addParticipant,
  getParticipants,
  updateParticipantStatus,
} from "../../controllers/participants/participants.controller.js";
import headerValidation from "../../utils/headerValidation.js";

const router = express.Router();

router.get("/participants", getParticipants);
router.post("/participants", participantValidation, addParticipant);
router.post("/status", headerValidation, updateParticipantStatus);

export default router;
