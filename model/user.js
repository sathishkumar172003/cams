const Sequelize = require('sequelize')
const sequelize = require("../util/database")


const User = sequelize.define('students', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull : false,
        primaryKey: true
    }, 
    username: Sequelize.DataTypes.STRING,
    email : Sequelize.DataTypes.STRING,
    password: Sequelize.DataTypes.STRING, 
    profile: {
        type:Sequelize.DataTypes.TEXT,
        allowNull:false
    }
}, {
    timestamps: false
})


module.exports = User;
