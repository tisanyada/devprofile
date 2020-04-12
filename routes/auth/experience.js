const router = require('express').Router();
const experienceController = require('../../controllers/auth/experience');
const {ensureAuthenticated} = require('../../config/auth');



// @route   GET /dev/experience
// @desc    Get the add experiencepage
// @access  private
router.get('/', ensureAuthenticated, experienceController.getAddExperiencePage);



// @route   POST /dev/experience
// @desc    Add experience to the user profile
// @access  private
router.post('/', ensureAuthenticated, experienceController.postCreateExperience);




// @route   GET /dev/experience/update/:exp_id
// @desc    Get experience by id
// @access  private
router.get('/update/:exp_id', ensureAuthenticated, experienceController.getExperienceById);


// @route   POST /dev/experience/update/:exp_id
// @desc    Update experience by id
// @access  private
router.post('/update/:exp_id', ensureAuthenticated, experienceController.postUpdateExperience);



// @route   GET /dev/experience/:exp_id
// @desc    Add experience to the user profile
// @access  private
router.get('/:exp_id', ensureAuthenticated, experienceController.postDeleteExperienceInfo);



module.exports = router;