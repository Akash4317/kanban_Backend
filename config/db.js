const mongoose = require('mongoose');

const connection = mongoose.connect('mongodb+srv://akashskylifts:G5XGGKuucN11mRth@cluster0.c6kqvkj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

module.exports = {
    connection
}