const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize=Sequelize;
//테이블을 서버와 연동시킨다.
db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize,Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
//user와 post 사이에 1:N 관계를 만든다.
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);
//post와 hashtag 사이에 N:M 관계를 만든다.
db.Post.belongsToMany(db.Hashtag,{through: 'PostHashtag'});//trough는 N:M 관계에서 만들어지는 또 다른 테이블임
db.Hashtag.belongsToMany(db.Post,{through:'PostHashtag'});
//같은 테이블 간 관계 형성, 같은 테이블은 외래키 이름을 지정해줘야 하고 as옵션의 이름을 설정해줘야 이름이 겹치지지 않음 p359참고
db.User.belongsToMany(db.User,{
  foreignKey : 'followingId',
  as : 'Followers',
  through : 'Follow',
});
db.User.belongsToMany(db.User,{
  foreignKey : 'followerId',
  as : 'Follwings',
  through : 'Follow',
});

module.exports = db;