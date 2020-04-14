const Profile = require("../../models/Profile");
const User = require("../../models/User");


const GitHub = require('github-api');
const axios = require('axios');



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

            const Repo = {
                count: 5,
                sort: 'created: asc',
                Client_ID: '52411f879e09cb884c41',
                Client_Secret: '105920e5e71dacd3733bab84e829a344e4258418'
            }
            axios.get(`https://api.github.com/users/${profile.githubusername}/repos?per_page=${Repo.count}&sort=${Repo.sort}&client_id=${Repo.Client_ID}&client_secret=${Repo.Client_Secret}`)
                .then(data => {
                    console.log(data);
                    const repos = [data];
                    res.render('public/profile', {
                        repos: data,
                        profile,
                        experience: profile.experience,
                        education: profile.education,
                        loggedIn: false
                    });
                })
                .catch(err => {
                    req.flash('error_msg', 'error connecting to github, please check your internet connection');
                    res.status(500).redirect('/api/profiles');
                });

        })
        .catch(err => {
            console.log(err)
            res.status(404).json({ profile: 'There is no profile for this user' });
        })
}


exports.getProfileByHandle = (req, res) => {
    Profile.findOne({ 'handle': req.params.handle })
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