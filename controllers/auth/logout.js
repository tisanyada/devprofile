


exports.postLogoutUser = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You have successfully logged out');
    res.redirect('/api/users/login');
}