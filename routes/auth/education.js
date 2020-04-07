const router = require('express').Router();
const educationController = require('../../controllers/auth/education');
const {ensureAuthenticated} = require('../../config/auth');



// @route   GET /dev/education
// @desc    Get the add education epage
// @access  private
router.get('/', ensureAuthenticated, educationController.getAddEducationPage);



// @route   POST /dev/education
// @desc    Add education to the user profile
// @access  private
router.post('/', ensureAuthenticated, educationController.postCreateEducation);



// @route   POST /dev/education/:edu_id
// @desc    Remove education info from user profile
// @access  private
router.get('/:edu_id', ensureAuthenticated, educationController.postDeleteEducationInfo);



module.exports = router;