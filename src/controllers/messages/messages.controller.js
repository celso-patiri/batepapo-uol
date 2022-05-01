import dayjs from "dayjs";
import { stripHtml } from "string-strip-html";
import responseData from "../../utils/responseData.js";

//filter used on mongodb query
const messageFilter = (name) => {
  return {
    $or: [
      { type: "message" },
      { to: { $regex: /todos/i } },
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
    const user = stripHtml(req.headers.user).result.trim();
    const limit = parseInt(req.query.limit);

    const results = await fetchMessages(user, messages, limit);

    res.status(200);
    return res.json(
      responseData(false, "Messages successfully retrieved", {
        messages: results,
      })
    );
  } catch (err) {
    console.error(err);
    res.status(400);
    res.json(responseData(true, err.message));
  }
};

const getCleanMessage = (message) => {
  const cleanMessage = {};
  for (const [key, value] of Object.entries(message)) {
    cleanMessage[key] = stripHtml(value).result.trim();
  }
  return cleanMessage;
};

const addMessage = async (req, res) => {
  try {
    const messages = req.app.db.collection("messages");

    const newMessage = getCleanMessage({
      from: req.headers.user,
      ...req.body,
    });
    newMessage.time = dayjs().format("HH:mm:ss");

    messages
      .insertOne(newMessage)
      .then(() => {
        res.status(201);
        res.json(responseData(false, "Message successfully added", newMessage));
      })
      .catch((err) => {
        console.error(err);
        res.status(403);
        res.json(responseData(true, "Error creating message"));
      });
  } catch (err) {
    console.error(err);
    res.status(400);
    res.json(responseData(true, err.message));
  }
};

export { addMessage, getMessages };
