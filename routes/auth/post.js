const router = require('express').Router();
const postController = require('../../controllers/auth/post');
const {ensureAuthenticated} = require('../../config/auth');




// @route   GET /dev/posts
// @desc    Get all post created by user
// @access  private
router.get('/', ensureAuthenticated, postController.getPostPage);



// @route   POST /dev/posts
// @desc    Create post
// @access  private
router.post('/', ensureAuthenticated, postController.createNewPostFeed);


// @route   GET /dev/posts/:post_id
// @desc    Get Post By Id
// @access  private
router.get('/:post_id', ensureAuthenticated, postController.getAddCommentToPostPage);


// @route   POST /dev/posts/:post_id
// @desc    Add comment to
// @access  private
router.post('/:post_id', ensureAuthenticated, postController.postAddCommentToPost);


// @route   DELETE /dev/posts/:post_id
// @desc    Delete post
// @access  private
router.get('/delete/:post_id', ensureAuthenticated, postController.deletePost);


// @route   POST /dev/posts/like/:id
// @desc    Like post
// @access  Private
router.get('/like/:id', ensureAuthenticated, postController.likePost);



// @route   POST /dev/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.get('/unlike/:id', ensureAuthenticated, postController.unlikePost);





module.exports = router;