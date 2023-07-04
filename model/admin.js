const Sequelize = require('sequelize')
const sequelize = require('../util/database')


const Admin = sequelize.define('admin', {
    id : {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    adminName : {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    email : {
        type: Sequelize.DataTypes.STRING,
        allowNull : false,
        unique : true,
    }, 
    password : {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    profile : {
        type: Sequelize.DataTypes.STRING,
    }


})

module.exports  = Admin;

