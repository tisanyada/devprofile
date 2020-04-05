const router = require('express').Router();
const registerController = require('../../controllers/public/register');



// @route   POST /api/users/register
// @desc    Create a new user
// @access  public
router.post('/register', registerController.postCreateNewUser);




module.exports = router;