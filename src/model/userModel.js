const { Sequelize } = require("sequelize")
const database = require("../../config/database.js")

const { DataTypes } = Sequelize;

const Users = database.define('users',{
    first_name: {
        type: DataTypes.STRING,
    },
    last_name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    token_refresh:{
        type: DataTypes.TEXT
    },
},{
    freezeTableName:true
});

module.exports = Users