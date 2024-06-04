const { Sequelize } = require("sequelize")

const database = new Sequelize('authen_db','root','',{
    host: "localhost",
    dialect: "mysql"
});

module.exports = database