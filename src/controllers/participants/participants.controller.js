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
    console.error(err);
    res.status(400);
    res.json(responseData(true, err.message));
  }
};

const addParticipant = async (req, res) => {
  try {
    const name = req.body.name;

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
      .catch((err) => {
        console.error(err);
        res.status(403);
        res.json(responseData(true, `Error creating participant ${name}`));
      });
  } catch (err) {
    console.error(err);
    res.status(400);
    res.json(responseData(true, err.message));
  }
};

const updateParticipantStatus = async (req, res) => {
  const user = { name: req.headers.user };
  const participants = req.app.db.collection("participants");

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
    console.error(err);
    res.status(404);
    res.json(responseData(true, err.message));
  }
};

export { getParticipants, addParticipant, updateParticipantStatus };
