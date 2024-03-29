const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");

const auth = async(req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, "masai", (err, decoded) => {
            if (err) {
                console.log(err)
                return res.status(401).json({ error: 'Unauthorized' });
            } else {
                req.body.userID = decoded.userID
                req.body.username = decoded.username
                req.role = decoded.role
                console.log(decoded)
                console.log(req.body)
                next()
            }

        })
    } else {
        res.json("Please Login!!")
    }
}


module.exports = {
    auth
}