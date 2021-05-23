const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

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

// 정보를 저장하기 전에 실행할 function 지정 -> next로 진행 
userSchema.pre('save', function (next) {
    // 상단의 정보를 this로 가져온다
    var user = this;
    
    // 비밀번호 변경할때 실행하도록 조건
    if (user.isModified('password')) {
        // 비밀번호를 암호화시킨다
        bcrypt.genSalt(saltRounds, function (err, salt) {
            // 에러나면 에러값을 리턴하면서 넘어간다
            if (err) return next(err)
            // 패스워드값을 해쉬한다
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})


userSchema.methods.comparePassword = function (plainPassword, cb) {
    // plainPassword는 실제로 입력된 PW
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function (cb) {
    var user = this;

    // jsonwebtoken으로 token 생성 (_id + secretToken으로 token 생성해서 저장)
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }