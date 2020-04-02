const router = require('express').Router();
const passport = require('passport');
const profileController = require('../../../controllers/auth/profile/profile');



// @route   GET api/profile
// @desc    Get Current users profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), profileController.getProfile);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', profileController.getAllProfiles);


// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', profileController.getProfileByHandle);

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/user/:user_id', profileController.getProfileById);

// @route   POST api/profile
// @desc    Post / Edit user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), profileController.createUserProfile);


// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), profileController.addExperienceToProfile);


// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), profileController.addEducationToProfile);


// @route   DELETE api/profile/experience/:exp_id
// @desc    Remove/Delete eexperience from profile
// @access  Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), profileController.deleteExperienceFromProfile);


// @route   DELETE api/profile/education/:edu_id
// @desc    Remove/Delete education from profile
// @access  Private
router.delete('/education/:exp_id', passport.authenticate('jwt', { session: false }), profileController.deleteEducationFromProfile);


// @route   DELETE api/profile
// @desc    Remove/Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), profileController.deleteUserAndProfile);



module.exports = router;