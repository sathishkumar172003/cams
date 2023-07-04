function adminAuth  (req, res, next)  {
    if(!req.session.adminLoggedIn) {
        return res.redirect('/admin/login')
    }
    next()
}

module.exports = adminAuth