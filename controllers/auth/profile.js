const Profile = require('../../models/Profile');
const validator = require('validator');


exports.getUserProfilePage = (req, res) => {
    const user = req.user;
    const errors = [];

    Profile.findOne({ 'user': user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.push({ msg: 'Your profile is blank, please fill the form to create one'});
                return res.status(404).render('auth/profile', {
                    errors,
                    userdata: '',
                    loggedIn: true
                });
            } else {
                res.render('auth/profile', {
                    userdata: profile,
                    loggedIn: true
                });
            }
        })
        .catch(err => {
            res.status(404).json(err);
        });
}

exports.postCreateProfile = (req, res) => {
    // get fields
    const
        {
            handle, company, website,
            location, bio, status, githubusername,
            skills, youtube, twitter, facebook,
            linkedin, instagram
        }
            = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (handle) profileFields.handle = handle;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    // skills
    if (typeof skills !== undefined) {
        profileFields.skills = skills.split(',');
    }

    // social handles
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    let errors = [];

    if (!handle) {
        errors.push({ msg: 'User handle field is required' })
    }

    if (!status) {
        errors.push({ msg: 'User status field is required' });
    }

    // if(!twitter){
    //     if(!validator.isURL(twitter)){
    //         errors.push({msg: 'Twitter handle field is invalid'});
    //     }
    // }

    if (errors.length > 0) {
        res.render('auth/profile', {
            errors,
            loggedIn: true
        });
    } else {
        // creating the profile
        Profile.findOne({ 'user': req.user.id })
            .then(profile => {
                if (profile) {
                    // profile exist ----- update
                    Profile.findOneAndUpdate({ 'user': req.user.id }, { $set: profileFields }, { new: true })
                        .then(profile => {
                            req.flash('success_msg', 'Your profile has been updated');
                            res.redirect('/dev/dashboard')
                        });
                } else {
                    // create ----- new
                    // --check if handle exists
                    Profile.findOne({ 'handle': profileFields.handle })
                        .then(profile => {
                            if (profile) {
                                errors.push({ msg: 'That profile handle already exists' });
                                res.status(400).render('auth/profile', {
                                    errors,
                                    loggedIn: true
                                });
                            }

                            // save profile
                            new Profile(profileFields).save()
                                .then(profile => {
                                    res.redirect('/dev/dashboard');
                                });
                        });
                }
            })
            .catch()
    }

}


exports.getProfileUpdatePage = (req, res)=>{

    Profile.findOne({'user': req.user.id})
        .then(profile =>{
            if(profile){
                res.render('auth/editProfile',{
                    profile,
                    loggedIn: true
                });
            }
        })
}


exports.postUpdateProfile = (req, res)=>{

    // get fields
    const
    {
        handle, company, website,
        location, bio, status, githubusername,
        skills, youtube, twitter, facebook,
        linkedin, instagram
    }
        = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (handle) profileFields.handle = handle;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    // skills
    if (typeof skills !== undefined) {
        profileFields.skills = skills.split(',');
    }

    // social handles
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    let errors = [];

    if (!handle) {
        errors.push({ msg: 'User handle field is required' })
    }

    if (!status) {
        errors.push({ msg: 'User status field is required' });
    }

    Profile.findOneAndUpdate({ 'user': req.user.id }, { $set: profileFields }, { new: true })
    .then(profile => {
        req.flash('success_msg', 'Your profile has been updated');
        res.redirect('/dev/dashboard')
    });

}