

exports.getDashboard = (req, res) => {
    res.render('auth/dashboard', {
        user: req.user,
        loggedIn: true
    });
}