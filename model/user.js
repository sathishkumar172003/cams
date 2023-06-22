const Sequelize = require('sequelize')
const sequelize = require("../util/database")


const User = sequelize.define('students', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull : false,
        primaryKey: true
    }, 
    username:{
        type:  Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull : {
                msg: 'name cant be null'
            }
        }
    },
    email : {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
        isEmail: true, 
        
    },
    password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    }, 
    profile: {
        type:Sequelize.DataTypes.TEXT,
        allowNull:false
    }
}, {
    timestamps: false
})



module.exports = User;
