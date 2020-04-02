const router = require('express').Router();
const registerController = require('../../controllers/public/register');



// @route   GET api/users/register
// @desc    Get the register page
// @access  public
router.get('/register', registerController.getRegister);

// @route   POST api/users/register
// @desc    Post the register page
// @access  public
router.post('/register', registerController.postRegister);



module.exports = router;