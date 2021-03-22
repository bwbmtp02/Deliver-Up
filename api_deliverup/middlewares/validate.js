const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.TOKEN_SECRET;

exports.checkJWT = async (req, res, next) => {
  let token = req.cookies.token; // create variable token and assign value from cookie named token
  // console.log(req.cookies)
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      // decoded is decoded object token with _id key
      if (err) {
        return res.status(401).json("token_not_valid");
      } else {
        if (decoded._id === req.cookies.id) {
          const newToken = jwt.sign(
            {
              _id: decoded._id,
            },
            SECRET_KEY
          );
          // console.log(newToken);
          res.cookie("token", newToken, {
            maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days
            httpOnly: true,
          });
          next();
        } else {
          return res.status(200).json("token_not_valid");
        }
      }
    });
  } else {
    return res.status(200).json("token_required");
  }
};
