const router = require('express').Router();
const profileController = require('../../controllers/auth/profile');
const { ensureAuthenticated } = require('../../config/auth');




// @route   GET /dev/profile
// @desc    Get user profile
// @access  private
router.get('/', ensureAuthenticated, profileController.getUserProfilePage);


// @route   POST /dev/profile
// @desc    Create user profile
// @access  private
router.post('/', ensureAuthenticated, profileController.postCreateProfile);


// @route   GET /dev/profile/update
// @desc    Get current user profile details
// @access  private
router.get('/update', ensureAuthenticated, profileController.getProfileUpdatePage);


// @route   POST /dev/profile/update
// @desc    Update current user profile details
// @access  private
router.post('/update', ensureAuthenticated, profileController.postUpdateProfile);



module.exports = router;