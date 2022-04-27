import express from "express";

const router = express.Router();
// TODO: implement middleware
router.get("/", (_req, res) => res.send("TODO: GET /messages"));

// TODO: implement middleware
router.post("/", (_req, res) => res.send("TODO: POST /messages"));

export default router;
