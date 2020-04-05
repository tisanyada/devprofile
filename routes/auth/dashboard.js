const router = require('express').Router();
const { ensureAuthenticated } = require('../../config/auth');
const dashboardController = require('../../controllers/auth/dashboard');


// @route   GET /dev/dashboard
// @desc    Get/Fetch user dashboard
// @access  private
router.get('/', ensureAuthenticated, dashboardController.getDashboard);



module.exports = router;