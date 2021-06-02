const { User } = require('../models/Users');


let auth = (req, res, next) => {
    //인증 처리를 하는곳
    //1.클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;

    //2. 토큰을 복호화한 후, 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true });
        
        //req에 토큰과 유저 정보를 저장해서 불러올 수 있도록 함
        req.token = token;
        req.user = user;
        //미들웨어라서 next로 다음단계 넘어감
        next();
    })
}


module.exports = { auth };