const router = require('express').Router();
const profilesController = require('../../controllers/public/profiles');





// @route   GET /dev/profiles/empty
// @desc    Get profiles errors page if profiles === null
// @access  public
router.get('/empty', profilesController.getEmptyProfilesPage);



// @route   GET /dev/profiles
// @desc    Get all profiles
// @access  public
router.get('/', profilesController.getAllProfiles);


// @route   GET /dev/profiles/:profile_id
// @desc    Get profile by id
// @access  public
router.get('/:profile_id', profilesController.getProfileById);


// @route   GET /dev/profiles/:handle
// @desc    Get profile by handle
// @access  public
router.get('/handle/:handle', profilesController.getProfileByHandle);




module.exports = router;