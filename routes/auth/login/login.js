const router = require('express').Router();
const loginController = require('../../../controllers/auth/login/login');
const passport = require('passport');



// @route   GET api/users/login
// @desc    Get the login page
// @access  public
router.get('/', loginController.getLogin);

// @route   POST api/users/login
// @desc    Get the login page
// @access  public
router.post('/login', loginController.postLogin);

// *****************      testing jwt
// @route   GET api/users/current
// @desc    Return current user
// @access  private
router.get('/current', passport.authenticate('jwt', {session: false}), loginController.getCurrentUser);



module.exports = router;