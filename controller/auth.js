module.exports.Logout = (req, res) => {
    res.clearCookie()
    res.send('cookies are cleared')
}


