
const Application = require('../model/application')
const User = require('../model/user')


module.exports.adminPage = (req, res) => {

    res.render('admin/admin_homepage.ejs')
}


module.exports.adminGetRegister = (req, res) => {
    res.render('admin/register.ejs')
}


module.exports.pendingApplications = (req, res) => {
    Application.findAll({where:{
        formStatus : 'pending'
    }})
    .then((applications) => {
        res.render('admin/pending_applications.ejs', {applications: applications})
    })
}

module.exports.viewSingleApplication = (req, res) => {
    let appId = req.params.appId ;
    Application.findOne({where: {
        id: appId
    }})
    .then(application => {
        res.render('admin/single_application.ejs',{application : application })
    })
    .catch(err => console.log(err))
    
}


module.exports.getUpdateApplication = (req, res) => {
    let appId = req.params.appId
    Application.findOne({where: {
        id  : appId
    }})
    .then(application => {
        res.render('admin/update_application.ejs', {application: application})
    })
    
}