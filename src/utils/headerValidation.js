import responseData from "./responseData.js";

const headerValidation = async (req, res, next) => {
  if (!req.headers.user) {
    res.status(401);
    return res.json(responseData(true, "'User' header is required"));
  }

  next();
};

export default headerValidation;
