const Profile = require("../../models/Profile");
const User = require("../../models/User");


const GitHub = require('github-api');



exports.getEmptyProfilesPage = (req, res) => {
    res.render('public/noProfiles', {
        loggedIn: false
    });
}




exports.getAllProfiles = (req, res) => {

    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            // if (!profiles) {
            //     res.redirect('/api/profiles/empty');
            // }

            res.render('public/profiles', {
                profiles,
                alt_avatar: '/public/images/person.jpg',
                loggedIn: false
            });

        })
        .catch(err => {
            res.status(404).json({
                profile: 'There are no profiles for all users',
                errors: err
            });
        });
}



exports.getProfileById = (req, res) => {
    Profile.findOne({ '_id': req.params.profile_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            console.log(profile);

            const repos = new GitHub({
                username: profile.githubusername
            })
            res.render('public/profile', {
                profile,
                experience: profile.experience,
                education: profile.education,
                loggedIn: false
            });
        })
        .catch(err => {
            res.status(404).json({ profile: 'There is no profile for this user' });
        })
}


exports.getProfileByHandle = (req, res) => {
    Profile.findOne({'handle': req.params.handle})
        .populate('user', ['name', 'avatar'])
        .then(profile => {

            console.log(profile);
            res.render('public/profileByHandle', {
                profile,
                loggedIn: false
            });
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({ profile: 'There is no profile for this user' });
        })
}