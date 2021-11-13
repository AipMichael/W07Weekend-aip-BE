const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    const error = new Error(
      "You have no permission for this. Better ask an adult!"
    );
    error.code = 401;
    next(error);
  } else {
    const token = authHeader.split(" ")[1];

    if (!token) {
      const error = new Error("Token missing.");
      error.code = 401;
      next(error);
    } else {
      try {
        const userData = jwt.verify(token, process.env.SECRET);
        req.userId = userData.id;
        req.userName = userData.name;
        next();
      } catch (error) {
        error.message = "Token not valid.";
        error.code = 401;
        next(error);
      }
    }
  }
};

module.exports = auth;
