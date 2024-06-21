const jwt = require("jsonwebtoken");
const dbgr = require("debug")("development:isLoggedIn");

const isLoggedIn = (req, res, next) => {
  try {
    let cookieToken = req.cookies.token;

    if (cookieToken) {
      jwt.verify(cookieToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          dbgr(`Error during isLoggedIn token verify: ${err}`);
          return next(new Error("Invalid Token"));
        }
        if (!decoded || !decoded.id || !decoded.email) {
          dbgr("Decoded token does not contain expected properties.");
          return next(new Error("Invalid Token"), { statusCode: 401 });
        }
        req.user = decoded;
        next();
      });
    } else {
      return next(new Error("Invalid Token"), { statusCode: 401 });
    }
  } catch (err) {
    dbgr(`Error during isLoggedIn: ${err}`);
    return next(new Error("Invalid Token"), { statusCode: 401 });
  }
};

module.exports.isLoggedIn = isLoggedIn;
