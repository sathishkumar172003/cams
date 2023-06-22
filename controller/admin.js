module.exports.adminPage = (req, res) => {

    res.render('admin/admin_homepage.ejs')
}


module.exports.adminGetRegister = (req, res) => {
    let isLoggedIn = req.session.isLoggedIn

    res.render('admin/register.ejs', {isLoggedIn: isLoggedIn})
}

