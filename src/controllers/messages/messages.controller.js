import dayjs from "dayjs";
import returnMessage from "../../utils/returnMessage.js";

//filter used on mongodb query
const messageFilter = (name) => {
  return {
    $or: [
      { type: "message" },
      {
        to: { $regex: new RegExp(name, "i") },
        type: "private_message",
      },
    ],
  };
};

const fetchMessages = async (user, messages, limit) => {
  const filter = messageFilter(user);
  if (isNaN(limit)) return await messages.find(filter).toArray();
  return await messages.find(filter).limit(limit).sort({ _id: -1 }).toArray();
};

const getMessages = async (req, res) => {
  try {
    const messages = req.app.db.collection("messages");
    const user = req.headers.user;
    const limit = parseInt(req.query.limit);

    const results = await fetchMessages(user, messages, limit);

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
