const router = require('express').Router();
const logoutController = require('../../controllers/auth/logout');


// @route   GET /logout
// @desc    Logout user from dashboard
// @access  private
router.get('/', logoutController.postLogoutUser);


module.exports = router;