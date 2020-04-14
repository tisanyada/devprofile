const User = require('../../models/User');
const uiavatar = require('ui-avatars');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const passwordValidator = require('password-validator');


exports.postCreateNewUser = (req, res) => {
    // cleecting req.body params
    const { name, email, password, password2 } = req.body;

    // the errors array
    let errors = [];

    // checking if all fields are null
    if (!name) {
        errors.push({ msg: 'Name field is required!' });
    }

    if (!email) {
        errors.push({ msg: 'Email field is required' });
    }

    if (!password) {
        errors.push({ msg: 'Password field is required' });
    }

    if (!password2) {
        errors.push({ msg: 'Confirm password field is required' });
    }

    if (!validator.isEmail(email)) {
        errors.push({ msg: 'Invalid email address' });
    }

    // password validation
    const passwordSchema = new passwordValidator();
    passwordSchema
        .is().min(6)
        .is().max(20)
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()                              // Must have lowercase letters
        // .has().digits()                                 // Must have digits
        // .has().symbols()

    if (!passwordSchema.validate(password)) {
        errors.push({ msg: 'Password must be at least 6 characters, with upper and lowercase letters'});
    }

    // ------------------ checking is errors array is null
    if (errors.length > 0) {
        res.render('public/register', {
            errors,
            loggedIn: false,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ 'email': req.body.email })
            .then(user => {
                if (user) {
                    errors.push({msg: 'Email already exists'});
                    return res.status(400).render('public/register', {
                        errors,
                        loggedIn: false,
                        name,
                        email,
                        password
                    });
                } else {
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
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can login');
                                    res.redirect('/api/users/login');
                                })
                                .catch(err => console.log(err));
                        })
                    });
                }
            })
            .catch(err => console.log(err));
    }

}