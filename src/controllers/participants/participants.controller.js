import returnMessage from "../../utils/returnMessage.js";

const addParticipant = async (req, res, _next) => {
  try {
    const name = req.body.name;

    const collection = req.app.db.collection("participants");
    const existingParticipant = await collection.findOne({ name });

    if (existingParticipant) {
      res.status(409);
      return res.json(returnMessage(true, `Name ${name} already taken`));
    } else {
      collection
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
    }
  } catch (err) {
    console.error(err);
    res.status(400);
    res.json(returnMessage(true, err.message));
  }
};
export { addParticipant };
