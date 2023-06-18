const Sequelize = require('sequelize')

const sequelize = new Sequelize('college_admission', 'root', 'SathishKumar@17', {
    host: 'localhost',
    dialect: 'mysql'
})


module.exports = sequelize ;

