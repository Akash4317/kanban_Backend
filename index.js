const express = require('express');
const { connection } = require('./config/db');
const { userrouter } = require('./routes/user.routes');
const { taskrouter } = require('./routes/task.routes');
const cors = require('cors');

const app = express()
app.use(express.json());
app.use(cors());
app.use("/user", userrouter);
app.use("/task", taskrouter);

app.listen(8080, async() => {
    try {
        await connection;
        console.log("Server is running on port 8080");
        console.log("Connected to the MongoDB atlas server");
    } catch (err) {
        console.log(err)
    }
})