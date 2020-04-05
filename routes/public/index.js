const router = require('express').Router();
const indexController = require('../../controllers/public/index');



// @route   GET /
// @desc    Get the landing
// @access  public
router.get('/', indexController.getIndexPage);


// @route   GET /api/users/register
// @desc    Get the register page
// @access  public
router.get('/api/users/register', indexController.getRegisterPage);



// @route   GET /api/users/login
// @desc    Get the login page
// @access  public
router.get('/api/users/login', indexController.getLoginPage);


module.exports = router;