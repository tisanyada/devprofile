// the user model
const User = require('../../models/User');
const uiavatar = require('ui-avatars');
const bcrypt = require('bcryptjs');

// load input validation
const validateRegisterInput = require('../../validation/register');


exports.getRegister = (req, res) => {
    res.send('register controller');
}

exports.postRegister = (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    // // check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ 'email': req.body.email })
        .then(user => {
            if (user){
                errors.email = 'Email already exists';
                return res.status(400).json(errors);
            } else {
                // destructuting the body params
                const { name, email, password } = req.body;

                // the user avatar
                const avatar = uiavatar.generateAvatar({
                    uppercase: true,
                    name: name,
                    background: 'ffffff',
                    color: 'fd7200',
                    fontsize: 0.5,
                    bold: true,
                    length: 2,
                    rounded: true,
                    size: 250
                });

                // creating a new user
                const user = new User({
                    name,
                    email,
                    password,
                    avatar
                });

                // encrypting the password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if (err) throw err;
                        user.password = hash;
                        // saving the new user
                        user.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                })
            }
        })
        .catch();
}