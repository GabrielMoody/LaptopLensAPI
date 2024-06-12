// require('dotenv').config()

const Sequelize = require("sequelize")

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASS, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
  port: 3306,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

sequelize.authenticate().then( () => {
  console.log('Connection has been established successfully.');
}).catch ((error) =>  {
  console.error('Unable to connect to the database:', error);
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db