const router = require('express').Router();
const loginController = require('../../controllers/auth/login');



// @route   POST /api/users/login
// @desc    Login in the user
// @access  public
router.post('/login', loginController.postLoginUser);



module.exports = router;