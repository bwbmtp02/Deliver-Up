const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.TOKEN_SECRET;

exports.secure = async (req, res, next) => {
    let token = req.params.token; // create variable token and assign value from variable named token
    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            // decoded is decoded object token with _id key
            if (err) {
                return res.status(401).json("token_not_valid");
            } else {
                // console.log("decoded " + decoded._id);
                // console.log("user " + req.params.user);
                if (decoded._id === req.params.user) {
                    // console.log("access granted !");
                    next();
                } else {
                    return res.status(200).json("wrong_token");
                }
            }
        });
    } else {
        return res.status(200).json("token_required");
    }
};
