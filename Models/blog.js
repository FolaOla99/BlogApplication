const { time } = require('console');
const mongoose = require('mongoose')


const blog = new mongoose.Schema({

    title:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String
    },
    tags: {
        type: String
    },
    author: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    state: {
       type: String,
       enum: ['draft', 'published'],
       default: 'draft'
    },
    read_count: {
        type: Number
    },
    reading_time: {
        type: Number
    },
    body: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Blog',blog);