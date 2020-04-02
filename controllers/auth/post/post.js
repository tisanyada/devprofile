const mongoose = require('mongoose');
const Post = require('../../../models/Post');
const Profile = require('../../../models/Profile');


// validation
const validatePostInput = require('../../../validation/post');


exports.hello = (req, res) => {
    res.send('hello');
}

exports.getAllPosts = (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then(posts => res.json(posts))
        .catch(err => {
            res.status(400).json({
                msg: 'No posts found ',
                error: err
            });
        })
}

exports.getPostById = (req, res) => {
    Post.findById({ '_id': req.params.id })
        .then(post => res.json(post))
        .catch(err => {
            res.status(404).json({
                msg: 'No post found with that /:id',
                error: err
            });
        })
}

exports.createPost = (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check validation
    if (!isValid) {
        // if any errors, send 400 status with errors object
        res.status(400).json(errors);
    }

    const { text } = req.body;
    const post = new Post({
        text,
        name: req.user.name,
        avatar: req.user.avatar,
        user: req.user.id
    });

    post.save()
        .then(post => {
            res.json(post)
        })
        .catch(err => {
            res.status(400).json({
                msg: 'Unable to create new post',
                error: err
            });
        })
}

exports.deletePost = (req, res) => {
    Profile.findOne({ 'user': req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    // check for post owner
                    if (post.user.toString() !== req.user.id) {
                        // unauthurised status
                        return res.status(401).json({
                            msg: 'User is not authorised to delete this post'
                        });
                    }

                    // delete
                    post.remove()
                        .then(() => {
                            res.json({
                                msg: 'Deleted post successfully'
                            });
                        })
                })
                .catch(err => {
                    res.status(404).json({
                        msg: 'No posts found for this user',
                        error: err
                    });
                })
        })
}

exports.likePost = (req, res) => {
    Profile.findOne({ 'user': req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({
                            msg: 'User already liked this post'
                        });
                    }

                    // Add user id to like array
                    post.likes.unshift({ user: req.user.id });

                    // save post
                    post.save()
                        .then(post => res.json(post));
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
                        return res.status(400).json({
                            msg: 'You have not liked this post'
                        });
                    }

                    // Get remove index
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);

                    // splice the array
                    post.likes.splice(removeIndex, 1);

                    // save post
                    post.save()
                        .then(post => res.json(post));
                })
        })
        .catch(err => {
            res.status(404).json({
                msg: 'No posts found for this user',
                error: err
            });
        });
}

exports.addCommentToPost = (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check validation
    if (!isValid) {
        // if any errors, send 400 status with errors object
        res.status(400).json(errors);
    }


    Post.findById(req.params.id)
        .then(post => {
            const { text } = req.body;
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
                .then(post => res.json(post))
        })
        .catch(err => {
            res.status(404).json({
                msg: 'No post was found',
                error: err
            })
        })

}


exports.deleteCommentFromPost = (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            // check if comment exist
            if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0){
                return res.status(404).json({
                    msg: 'Comment does not exists'
                })
            }

            const removeIndex = post.comments
                .map(item => item._id.toString())
                .indexOf(req.params.comment_id);

            // splice comment out of array
            post.comments.splice(removeIndex, 1);

            // save comments
            post.save()
                .then(post => res.json(post))
        })
        .catch(err => {
            res.status(404).json({
                msg: 'No post was found',
                error: err
            })
        })
}