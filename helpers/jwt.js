const expressJwt = require("express-jwt");
require("dotenv").config();

function authJwt() {
  const api = process.env.API_URL;
  return expressJwt({
    secret: process.env.SECRET_KEY,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      `${api}/users/login`,
      `${api}/users/register`,
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/category(.*)/, methods: ["GET", "OPTIONS"] },
    ],
  });
}

const isRevoked = async (req, payload, done) => {
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
};

module.exports = authJwt;
