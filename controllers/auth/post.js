const Post = require('../../models/Post');
const validateText = require('password-validator');
const Profile = require('../../models/Profile');




exports.getPostPage = (req, res) => {
    Post.find()
        .sort({ '_id': -1 })
        .then(posts => {
            res.render('auth/post', {
                posts,
                user: req.user,
                loggedIn: true
            });
        })
        .catch(err => {
            res.status(400).json({
                msg: 'No posts found ',
                error: err
            });
        })
}

exports.createNewPostFeed = (req, res) => {
    const { text } = req.body;
    let errors = [];

    const textSchema = new validateText();
    textSchema
        .is().min(10)
        .is().max(500);

    if (!text) {
        errors.push({ msg: 'Post field is required' });
    }

    if (textSchema.validate(text) != true) {
        errors.push({ msg: 'Post field must have at least 10 characters and 500 characters' });
    }

    // if errors
    if (errors.length > 0) {
        res.render('auth/post', {
            errors,
            posts: '',
            user: req.user,
            loggedIn: true
        });
    } else {
        const post = new Post({
            text,
            name: req.user.name,
            avatar: req.user.avatar,
            user: req.user.id
        });

        post.save()
            .then(post => {
                req.flash('success_msg', 'successfully created a new post');
                res.redirect('/dev/posts');
            })
            .catch(err => {
                res.status(400).json({
                    msg: 'Unable to create new post',
                    error: err
                });
            });
    }

}


exports.deletePost = (req, res) => {

    Profile.findOne({ 'user': req.user.id })
        .then(profile => {
            Post.findById(req.params.post_id)
                .then(post => {
                    console.log(post)
                    // check for post owner = user
                    if (post.user.toString() !== req.user.id) {
                        // unauthorised status
                        req.flash('error_msg', "sorry, you can't delete this post as you don't own it");
                        return res.status(401).redirect('/dev/posts');
                    }

                    // delete
                    post.remove()
                        .then(() => {
                            req.flash('success_msg', "successfully deleted post");
                            res.redirect('/dev/posts');
                        })
                })
                .catch(err => {
                    console.log(err)
                    res.status(404).json({
                        msg: 'No posts found for this user',
                        error: err
                    });
                });
        });
}


exports.likePost = (req, res) => {
    Profile.findOne({ 'user': req.user.id })
        .then(profile => {
            console.log(profile)
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        req.flash('error_msg', 'sorry, you have already liked this post');
                        return res.status(400).redirect('/dev/posts');
                    }

                    // Add user id to like array
                    post.likes.unshift({ user: req.user.id });

                    // save post
                    post.save()
                        .then(post => {
                            req.flash('success_msg', 'you liked a post');
                            res.redirect('/dev/posts')
                        });
                })
        })
        .catch(err => {
            res.status(404).json({
                msg: 'No posts found for this user',
                error: err
            });
        });
}


exports.unlikePost = (req, res) => {
    Profile.findOne({ 'user': req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        req.flash('error_msg', 'you have not liked this post');
                        return res.status(400).redirect('/dev/posts');
                    }

                    // Get remove index
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);

                    // splice the array
                    post.likes.splice(removeIndex, 1);

                    // save post
                    post.save()
                        .then(post => {
                            req.flash('success_msg', 'you disliked a post');
                            res.redirect('/dev/posts')
                        });
                })
        })
        .catch(err => {
            res.status(404).json({
                msg: 'No posts found for this user',
                error: err
            });
        });
}


exports.getAddCommentToPostPage = (req, res) => {
    Post.findById(req.params.post_id)
        .then(post => {
            res.render('auth/comment', {
                comment: post,
                loggedIn: true,
                user: req.user
            })
        })
        .catch(err => {
            console.log(err);
        });
}


exports.postAddCommentToPost = (req, res) => {
    Post.findById(req.params.post_id)
        .then(post => {
            const { text } = req.body;
            let errors = [];

            const textSchema = new validateText();
            textSchema
                .is().min(10)
                .is().max(500);

            if (!text) {
                errors.push({ msg: 'Comment field is required' });
            }

            if (textSchema.validate(text) != true) {
                errors.push({ msg: 'Comment field must have at least 10 characters and 500 characters' });
            }

            // if errors
            if (errors.length > 0) {
                res.render('auth/comment', {
                    errors,
                    comment: post,
                    user: req.user,
                    loggedIn: true
                });
            } else {
                const { name, avatar, id } = req.user;
                const newComment = {
                    text,
                    name,
                    avatar,
                    user: id
                }

                // add to comments
                post.comments.unshift(newComment);

                // save comments
                post.save()
                    .then(post => {
                        req.flash('success_msg', 'successfully posted a comment');
                        res.redirect(`/dev/posts/${post.id}`);
                    });
            }
        })
        .catch(err => {
            res.status(404).json({
                msg: 'No post was found',
                error: err
            })
        })


}