const expressJwt = require("express-jwt");
require("dotenv").config();

const authJwt = () => {
  const secret = process.env.SECRET_KEY;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
  });
};
module.exports = authJwt;
