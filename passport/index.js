const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const {User} = require('../models');
const passport = require('passport');

module.exports = (passport) => {
    passport.serializeUser((user,done)=>{//req.session 객체에 어떤 데이터를 저장할지 선택함
        done(null, user.id);//매개변수로 user로 받아 done 함수에 두번째 인자로 user.id를 넘김. done의 첫번째 인자는 에러 발생시
    });//user.id는 사용자의 아이디만 저장하라고 명령한 것.

    passport.deserializeUser((id,done)=>{//serializeUser에서 세션에 저장했던 아이디를 받아 디비에서 사용자 정보를 조회
        User.findOne({where:{id}})
            .then(user=>done(null,user))
            .catch(err=>done(err));
    });

    local(passport);
    kakao(passport);
}