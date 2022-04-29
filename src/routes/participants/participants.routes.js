import express from "express";
import participantValidation from "../../controllers/participants/participant.validator.js";
import {
  addParticipant,
  getParticipants,
} from "../../controllers/participants/participants.controller.js";

const router = express.Router();

router.get("/", getParticipants);
router.post("/", participantValidation, addParticipant);

export default router;
