const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const Course = sequelize.define('course', {
    id : {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    department : {
        type: Sequelize.DataTypes.STRING,
        allowNull : false,
    },
    courseName : {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    timestamps: false
})

module.exports = Course;
