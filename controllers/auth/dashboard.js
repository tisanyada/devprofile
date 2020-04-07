const Profile = require("../../models/Profile");





exports.getDashboard = (req, res) => {
    // console.log(res.json(req.user));
    Profile.findOne({'user':req.user.id})
        .then(profile =>{
            if(!profile){
                res.redirect('/dev/profile');
            }

            res.render('auth/dashboard',{
                experience: profile.experience,
                education: profile.education,
                user: req.user,
                profileExist: true,
                loggedIn: true
            })
        })
        .catch(err =>{
            console.log(err);
        });
}