const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
        // trim은 빈칸있으면 이어줌, unique 1 은 고유의 값으로 설정
    },
    password: {
        type: String,
        minLength: 5
    },
    lastName: {
        type: String,
        maxLength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})


const User = mongoose.model('User', userSchema)

module.exports = { User }