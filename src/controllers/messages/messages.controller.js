import dayjs from "dayjs";
import returnMessage from "../../utils/returnMessage.js";

const getMessages = async (req, res) => {
  try {
    const messages = req.app.db.collection("messages");
    const results = await messages.find({}).toArray();

    res.status(200);
    return res.json(
      returnMessage(false, "Messages successfully retrieved", {
        messages: results,
      })
    );
  } catch (err) {
    console.error(err);
    res.status(400);
    res.json(returnMessage(true, err.message));
  }
};

const addMessage = async (req, res) => {
  try {
    const messages = req.app.db.collection("messages");

    const newMessage = {
      time: dayjs().format("HH:mm:ss"),
      from: req.headers.user,
      ...req.body,
    };

    messages
      .insertOne(newMessage)
      .then(() => {
        res.status(201);
        res.json(
          returnMessage(false, "Message successfully added", newMessage)
        );
      })
      .catch((err) => {
        console.error(err);
        res.status(403);
        res.json(returnMessage(true, "Error creating message"));
      });
  } catch (err) {
    console.error(err);
    res.status(400);
    res.json(returnMessage(true, err.message));
  }
};

export { addMessage, getMessages };
