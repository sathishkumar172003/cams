const Sequelize = require("sequelize")

const sequelize = require('../util/database')

const Notice = sequelize.define('notices', {
    id :{
        type: Sequelize.DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    title : {
        type: Sequelize.DataTypes.STRING,
        allowNull : false
    },
    content : {
        type: Sequelize.DataTypes.STRING,
        allowNull : false
    },
    createdAt: {
        field: 'created_at',
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
     }
}, {
    timestamps: false
})

module.exports = Notice;