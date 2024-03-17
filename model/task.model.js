const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    title: String,
    description: String,
    status: { type: String, enum: ['to-do', 'in-progress', 'done'], default: 'to-do' },
    userID: String,
    username: String,
    role: { type: String, enum: ["admin", "user"], default: 'user' }
}, {
    versionKey: false
})

const TaskModel = mongoose.model("task", taskSchema)

module.exports = {
    TaskModel
}