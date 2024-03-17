const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const { access } = require('../middleware/access.middleware');
const { TaskModel } = require('../model/task.model');

const taskrouter = express.Router();

taskrouter.get("/", (req, res) => {
    res.send("This is taskrouter testing Page")
})

taskrouter.post("/", auth, access("admin", "user"), async(req, res) => {
    try {
        const task = new TaskModel(req.body);
        const save = await task.save();
        res.status(200).json(save);
    } catch (err) {
        res.status(400).json(err)
    }
})

taskrouter.get("/", auth, access("admin", "user"), async(req, res) => {
    try {
        if (req.role === "user") {
            const tasks = await TaskModel.find({ userID: req.body.userID })
            res.json(tasks)
        }

        const tasks = await TaskModel.find()
        res.json(tasks)
    } catch (err) {
        res.json(err.message)
    }
})

taskrouter.patch("/:id", auth, access("user", "admin"), async(req, res) => {
    const payload = req.body;
    const { id } = req.params;
    try {
        const task = await TaskModel.findOne({ _id: id });
        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }
        if (req.role === "admin") {
            await TaskModel.findByIdAndUpdate(id, payload);
            return res.json({ msg: `The task with ID: ${id} has been updated by admin` });
        }

        if (req.body.userID === task.userID) {
            await TaskModel.findByIdAndUpdate(id, payload);
            return res.json({ msg: `The task with ID: ${id} has been updated by the owner` });
        } else {
            return res.status(403).json({ msg: "You don't have permission to update this task" });
        }
    } catch (err) {
        return res.status(500).json({ msg: "Internal server error", error: err });
    }
});



taskrouter.delete("/:id", auth, access("user", "admin"), async(req, res) => {
    const { id } = req.params;
    try {
        const task = await TaskModel.findOne({ _id: id });
        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }
        if (req.role === "admin") {
            await TaskModel.findByIdAndDelete({ _id: id });
            return res.json({ msg: `The task with ID: ${id} has been deleted by admin` });
        }
        if (req.body.userID === task.userID) {
            await TaskModel.findByIdAndDelete({ _id: id });
            return res.json({ msg: `The task with ID: ${id} has been deleted by the owner` });
        } else {
            return res.status(403).json({ msg: "You don't have permission to delete this task" });
        }
    } catch (err) {
        return res.status(500).json({ msg: "Internal server error", error: err });
    }
});




module.exports = {
    taskrouter
}