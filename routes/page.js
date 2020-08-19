const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const { Post,User} =require('../models');

const router = express.Router();

router.get('/profile', isLoggedIn, (req, res) => {//자신의 프로필은 로그인해야 볼수 있으므로 isLoggedIn
  res.render('profile', { title: '내 정보 - NodeBird', user: req.user });//isAuthenticated가 true여야 next가 호출되어 res.render미들웨어로 넘어감
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', {
    title: '회원가입 - NodeBird',
    user: req.user,
    joinError: req.flash('joinError'),
  });
});

router.get('/', (req, res, next) => {
  Post.findAll({
    include: {
      model: User,
      attributes: ['id', 'nick'],
    },
    order: [['createdAt', 'DESC']],
  })
    .then((posts) => {
      res.render('main', {
        title: 'NodeBird',
        twits: posts,
        user: req.user,
        loginError: req.flash('loginError'),
      });
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
});

module.exports = router;
