exports.getIndexPage = (req, res)=>{
    res.render('public/index',{
        loggedIn: false
    });
}


exports.getRegisterPage = (req, res)=>{
    res.render('public/register',{
        loggedIn: false
    });
}


exports.getLoginPage = (req, res)=>{
    res.render('public/login',{
        loggedIn: false
    });
}
