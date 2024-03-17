const express = require('express');
const bcrypt = require('bcrypt');
const userrouter = express.Router();
const { UserModel } = require("../model/user.model")
const jwt = require('jsonwebtoken');

userrouter.get('/', (req, res) => {
    res.send("this is users testing page")
})

userrouter.post("/register", async(req, res) => {
    const { username, email, pass, role } = req.body;
    try {
        bcrypt.hash(pass, 5, async(err, hash) => {
            if (err) {
                res.status(400).json(err)
            } else {
                const user = new UserModel({
                    username,
                    email,
                    pass: hash,
                    role
                });
                await user.save();
                res.status(200).json({ msg: "Registration succesfull" })
            }
        })
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

userrouter.post("/login", async(req, res) => {
    const { email, pass } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            bcrypt.compare(pass, user.pass, async(err, result) => {
                if (result) {
                    const token = jwt.sign({ userID: user._id, username: user.username, role: user.role }, "masai");
                    res.status(200).json({ msg: "Login successful", token })

                } else {
                    res.status(400).json({ message: err.message });
                }
            })
        } else {
            res.status(400).json({ message: "user not found" })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})



module.exports = {
    userrouter
}