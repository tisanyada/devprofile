const router = require('express').Router();
const profileController = require('../../controllers/auth/profile');
const { ensureAuthenticated } = require('../../config/auth');




// @route   GET /logout
// @desc    Logout user from dashboard
// @access  private
router.get('/', ensureAuthenticated, profileController.getUserProfilePage);





module.exports = router;