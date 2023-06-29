const Sequelize = require('sequelize')

const sequelize = require('../util/database')



const Application = sequelize.define('applications', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey : true,

    },
    course : {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'please select course'
            }
        }
    }, 

    fatherName : {
        type: Sequelize.DataTypes.STRING, 
        allowNull: false,
        validate: {
            notNull:{
                msg: 'fathers name can\'t be null '
            }
        }
    }, 

    motherName: {
        type: Sequelize.DataTypes.STRING, allowNull: false ,
        validate: {
            notNull: {
                msg: 'mothers name can\'t be null'
            }
        }
    },
    gender : {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'please select gender'
            }
        }
    
    },
    percentage10 : {
        type:Sequelize.DataTypes.INTEGER,
        allowNull: false,
   
    },

    percentage12: {
        type:Sequelize.DataTypes.INTEGER,
        allowNull: false,
    
    },
    profile : {
        type:Sequelize.DataTypes.STRING, 
        allowNull: false,
        validate: {
            notNull: 'please upload your photo to continue'
        }
    }, 
    DOB : {
        type:Sequelize.DataTypes.DATEONLY,
        allowNull: false,
    }, 
    age : {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
     
    },

    nationality : {
        type:Sequelize.DataTypes.STRING,
        defaultValue: 'India',
    },
    address : {
        type:Sequelize.DataTypes.STRING,
        allowNull: false
    },
    category : {
        type: Sequelize.DataTypes.STRING,
        allowNull : false
    },
    yearOfPassing10 : {
        type:Sequelize.DataTypes.INTEGER,
        allowNull:true,
    },
    yearOfPassing12 : {
        type:Sequelize.DataTypes.INTEGER,
        allowNull:true

    }, 
    board10 : {
        type:Sequelize.DataTypes.STRING,
        allowNull: false
    }, 
    board12 : {
        type:Sequelize.DataTypes.STRING,
        allowNull:false
    }, 
    stream10 : {
        type:Sequelize.DataTypes.STRING,
        allowNull: false,
    }, 
    stream12 : {
        type:Sequelize.DataTypes.STRING,
        allowNull: false
    }, 
    tc : {
        type:Sequelize.DataTypes.TEXT,
    },
    marksheet10: {
        type:Sequelize.DataTypes.TEXT
    }, 
    marksheet12 : {
        type:Sequelize.DataTypes.TEXT
    }, 
    formStatus : {
        type:Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: 'pending'
    },
    payment: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: false,
})


module.exports = Application;
