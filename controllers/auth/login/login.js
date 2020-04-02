// the user model
const User = require('../../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/keys');


// load input validation
const validateLoginInput = require('../../../validation/login');


exports.getLogin = (req, res) => {
    res.send('login controller');
}

exports.postLogin = (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    const { email, password } = req.body;

    // Find User by email
    User.findOne({ 'email': email })
        .then(user => {
            // check user
            if (!user) {
                errors.email = 'User not found';
                return res.status(404).json(errors);
            }

            // check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // user matched[found]
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        } //create jwt payload

                        // sign token
                        jwt.sign(payload, keys.SecretOrKey, { expiresIn: 3600 }, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            });
                        });

                    } else {
                        errors.password = 'Incorrect password';
                        return res.status(400).json(errors);
                    }
                })
        })
        .catch(err => {
            res.status(404).json({
                errMsg: 'unable to access database and find user',
                error: err
            });
        });
}

exports.getCurrentUser = (req, res)=>{
    res.json({
        msg: req.user
    });
}




