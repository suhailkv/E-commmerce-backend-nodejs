const { expressjwt: jwt } = require("express-jwt");
require("dotenv/config");

const secret = process.env.SECRET;
const api = process.env.APP_URL;

jwtAuth = jwt({
  secret: secret,
  algorithms: ["HS256"],
  isRevoked: isRevoked,
}).unless({
  path: [
    { url: /\/api\/v1\/product\/(.*)/, method: ["GET", "OPTIONS"] },
    { url: /\/api\/v1\/category\/(.*)/, method: ["GET", "OPTIONS"] },
    { url: `${api}/user/login`, method: ["POST", "OPTIONS"] },
    { url: `${api}/user`, method: ["POST", "OPTIONS"] },
    // { url: `${api}/user/get/count`, method: ["GET", "OPTIONS"] },
    { url: `${api}/user/:id`, method: ["DELETE", "OPTIONS"] },
  ],
});
async function isRevoked(req, token) {
  if (!token.payload.isAdmin) {
    return true;
  }
}
module.exports = jwtAuth;
