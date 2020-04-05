const passport = require("passport");


exports.postLoginUser = (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/dev/dashboard',
        failureRedirect: '/api/users/login',
        failureFlash: true
    })(req, res, next);
}