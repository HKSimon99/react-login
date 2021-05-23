const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./models/Users');
const config = require('./config/key');

// application/x-www-form-urlencoded -> 해석
app.use(bodyParser.urlencoded({ extended: true }));
//application/json -> 해석
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('Hello World! HKSIMON')
})

app.post('/register', (req, res) => {
    // 회원가입할때 필요한 정보들을 client에서 가져오고 database에 넣어준다.
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})


app.post('/login', (req, res) => {
    // 요청된 이메일을 DB에서 찾는다
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "해당 이메일로 가입된 유저가 존재하지 않습니다."
            })
        }

        // 이메일이 있다면 PW도 같은지 확인한다
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
            
            // 비밀번호도 같다면 Token을 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                // 토큰을 쿠키에 저장하지만 로컬스토리지 등 다른 위치에도 가능
                res.cookie("x_auth", user.token) //x_auth라는 쿠키에 토큰저장
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})