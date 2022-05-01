import dayjs from "dayjs";
import { stripHtml } from "string-strip-html";
import responseData from "../../utils/responseData.js";

const getParticipants = async (req, res) => {
  try {
    const participants = req.app.db.collection("participants");
    const results = await participants.find({}).toArray();

    res.status(200);
    return res.json(
      responseData(false, "Participants successfully retrieved", {
        participants: results,
      })
    );
  } catch (err) {
    res.status(400);
    res.json(responseData(true, err.message));
  }
};

const addParticipant = async (req, res) => {
  try {
    const name = stripHtml(req.body.name).result.trim();

    const participants = req.app.db.collection("participants");
    const existingParticipant = await participants.findOne({ name });

    if (existingParticipant) {
      res.status(409);
      res.json(responseData(true, `Name ${name} already taken`));
      return;
    }

    participants
      .insertOne({ name })
      .then(() => {
        res.status(201);
        res.json(responseData(false, `Participant ${name} added`, { name }));
      })
      .catch((_err) => {
        res.status(403);
        res.json(responseData(true, `Error creating participant ${name}`));
      });
  } catch (err) {
    res.status(400);
    res.json(responseData(true, err.message));
  }
};

const updateParticipantStatus = async (req, res) => {
  const participants = req.app.db.collection("participants");
  const user = { name: stripHtml(req.headers.user).result.trim() };

  try {
    const mongoResponse = await participants.updateOne(user, {
      $set: { lastStatus: Date.now() },
    });

    if (mongoResponse.modifiedCount === 0)
      throw { message: "Participant not found on database" };

    res.status(200);
    res.json(
      responseData(false, `${user.name}: Status updated successfully`, {
        name: user.name,
        ...mongoResponse,
      })
    );
  } catch (err) {
    res.status(404);
    res.json(responseData(true, err.message));
  }
};

const removeInactiveParticipants = async (participants, messages) => {
  const tenSecondsAgo = Date.now() - 10000;
  try {
    const inactiveParticipants = await participants
      .find({
        $or: [
          { lastStatus: { $lt: tenSecondsAgo } },
          { lastStatus: { $exists: false } },
        ],
      })
      .toArray();

    inactiveParticipants.forEach(async (participant) => {
      await participants.deleteOne({ __id: participant.__id });
      await messages.insertOne({
        from: participant.name,
        to: "Todos",
        text: "sai da sala...",
        type: "status",
        time: dayjs().format("HH:mm:ss"),
      });
    });
  } catch (err) {
    console.error(err);
  }
};

const inactiveParticipantsCleaner = (db) => {
  const participants = db.collection("participants");
  const messages = db.collection("messages");
  setInterval(() => removeInactiveParticipants(participants, messages), 10000);
};

export {
  getParticipants,
  addParticipant,
  updateParticipantStatus,
  inactiveParticipantsCleaner,
};
