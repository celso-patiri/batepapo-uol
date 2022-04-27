import returnMessage from "../../utils/returnMessage.js";

const getParticipants = async (req, res) => {
  try {
    const participants = req.app.db.collection("participants");
    const results = await participants.find({});

    res.status(200);
    return res.json(
      returnMessage(false, "Participants successfully retrieved", {
        participants: Array.from(results),
      })
    );
  } catch (err) {
    console.error(err);
    res.status(400);
    res.json(returnMessage(true, err.message));
  }
};

const addParticipant = async (req, res) => {
  try {
    const name = req.body.name;

    const participants = req.app.db.collection("participants");
    const existingParticipant = await participants.findOne({ name });

    if (existingParticipant) {
      res.status(409);
      res.json(returnMessage(true, `Name ${name} already taken`));
      return;
    }

    participants
      .insertOne({ name })
      .then(() => {
        res.status(201);
        res.json(returnMessage(false, `Participant ${name} added`, { name }));
      })
      .catch((err) => {
        console.error(err);
        res.status(403);
        res.json(returnMessage(true, `Error creating participant ${name}`));
      });
  } catch (err) {
    console.error(err);
    res.status(400);
    res.json(returnMessage(true, err.message));
  }
};
export { getParticipants, addParticipant };
