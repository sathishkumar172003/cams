module.exports.homepage = (req, res)=>{
    console.log(req.cookies['token name'])
    res.render('home.ejs')
}

module.exports.about = (req, res)=>{    
    res.render('about.ejs')
}

module.exports.admission =  (req, res)=>{
    res.render('admission.ejs')
}


module.exports.getApplicationForm = (req, res) => {
    res.render('application-form.ejs')
}


module.exports.eligibility = (req, res) => {
    res.render('eligibility.ejs')
}

