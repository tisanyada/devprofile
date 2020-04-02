const mongoose = require('mongoose');


// Models
const Profile = require('../../../models/Profile');
const User = require('../../../models/User');

// load input validation
const validateProfileInput = require('../../../validation/profile');
const validateExperienceInput = require('../../../validation/experience');
const validateEducationInput = require('../../../validation/education');


exports.getProfilePage = (req, res) => {
    res.send('profile page');
}

exports.getAllProfiles = (req, res) => {
    const errors = {};

    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errors.noProfiles = 'There are no profile for all users';
                res.status(404).json(errors);
            }

            res.json(profiles);
        })
        .catch(err => {
            res.status(404).json({ profile: 'There are no profiles for all users' });
        });
}

exports.getProfileByHandle = (req, res) => {
    const errors = {};

    Profile.findOne({ 'handle': req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noProfile = 'There is no profile for this user';
                res.status(400).json(errors);
            }

            res.json(profile);
        })
        .catch(err => {
            res.status(404).json(err);
        })
}

exports.getProfileById = (req, res) => {
    const errors = {};

    Profile.findOne({ 'user': req.params.user_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noProfile = 'There is no profile for this user';
                res.status(400).json(errors);
            }

            res.json(profile);
        })
        .catch(err => {
            res.status(404).json({ profile: 'There is no profile for this user' });
        })
}

exports.getProfile = (req, res) => {
    const user = req.user;
    const errors = {};

    Profile.findOne({ 'user': user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noProfile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => {
            res.status(404).json(err);
        });
}


exports.createUserProfile = (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // check validation
    if (!isValid) {
        // return errors in the 4oo error handle
        res.status(400).json(errors);
    }

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


    // creating the profile
    Profile.findOne({ 'user': req.user.id })
        .then(profile => {
            if (profile) {
                // profile exist ----- update
                Profile.findOneAndUpdate({ 'user': req.user.id }, { $set: profileFields }, { new: true })
                    .then(profile => res.json(profile))
            } else {
                // create ----- new
                // --check if handle exists
                Profile.findOne({ 'handle': profileFields.handle })
                    .then(profile => {
                        if (profile) {
                            errors.handle = "That profile handle already exists";
                            res.status(400).json(errors);
                        }

                        // save profile
                        new Profile(profileFields).save()
                            .then(profile => res.json(profile));
                    });
            }
        })
        .catch()

}


exports.addExperienceToProfile = (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // check validation
    if (!isValid) {
        // return errors in the 4oo error handle
        res.status(400).json(errors);
    }

    Profile.findOne({ 'user': req.user.id })
        .then(profile => {
            const {title, company, location, from, to, current, description} = req.body;
            const newExp = {
                title,
                company,
                location,
                from,
                to,
                current,
                description
            }

            // Add to exp array
            profile.experience.unshift(newExp);
            // saving the experience added
            profile.save()
                .then(profile => {
                    res.json(profile);
                })
        })
        .catch(err => {
            res.status(404).json({
                msg: 'User profile not found',
                error: err
            });
            console.log(err);
        })
}

exports.addEducationToProfile = (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // check validation
    if (!isValid) {
        // return errors in the 4oo error handle
        res.status(400).json(errors);
    }

    Profile.findOne({ 'user': req.user.id })
        .then(profile => {
            const {school, degree, fieldofstudy, from, to, current, description} = req.body;
            const newEdu = {
                school,
                degree,
                fieldofstudy,
                from,
                to,
                current,
                description
            }

            // Add to exp array
            profile.education.unshift(newEdu);
            // saving the experience added
            profile.save()
                .then(profile => {
                    res.json(profile);
                })
        })
        .catch(err => {
            res.status(404).json({
                msg: 'User profile not found',
                error: err
            });
            console.log(err);
        })
}

exports.deleteExperienceFromProfile = (req, res)=>{
    Profile.findOne({'user': req.user.id})
        .then(profile =>{
            // Get item remove index
            const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id);

            // splice item out of array
            profile.experience.splice(removeIndex, 1);

            // save
            profile.save()
                .then(profile => res.json(profile));
        })
        .catch(err =>{
            res.status(404).json({
                msg: 'User profile not found',
                error: err
            })
        })
}

exports.deleteEducationFromProfile = (req, res)=>{
    Profile.findOne({'user': req.user.id})
        .then(profile =>{
            // Get item remove index
            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.edu_id);

            // splice item out of array
            profile.education.splice(removeIndex, 1);

            // save
            profile.save()
                .then(profile => res.json(profile));
        })
        .catch(err =>{
            res.status(404).json({
                msg: 'User profile not found',
                error: err
            })
        })
}

exports.deleteUserAndProfile = (req, res)=>{
    Profile.findOneAndRemove({'user': req.user.id})
        .then(() =>{
            User.findOneAndRemove({'_id': req.user.id})
                .then(()=>{
                    res.json({
                        msg: 'Deleted user and profile successfully'
                    });
                })
        })
        .catch(err =>{
            res.status(404).json({
                msg: 'No user profile found',
                error: err
            })
        })
}