import express from "express";
import participantValidation from "../controllers/participants/participant.validator.js";
import { addParticipant } from "../controllers/participants/participants.controller.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  return res.send("Get participants");
});

router.post("/", participantValidation, addParticipant);

export default router;
