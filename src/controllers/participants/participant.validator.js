import joi from "joi";
import returnMessage from "../../utils/returnMessage.js";

const validation = joi.object({
  name: joi.string().min(1).required(),
});

const participantValidation = async (req, res, next) => {
  const payload = req.body;

  const { error } = validation.validate(payload);
  if (error) {
    res.status(422);
    return res.json(returnMessage(true, "Name cannot be empty"));
  }

  next();
};

export default participantValidation;
