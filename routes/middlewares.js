exports.isLoggedIn = (req,res,next)=>{//로그인 여부를 검사하는 미들웨어
    if(req.isAuthenticated()){//로그인 중이면 true
        next();
    }else{
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        next();
    }else{
        res.redirect('/');
    }
}