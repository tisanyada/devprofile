const Profile = require('../../models/Profile');


exports.getUserProfilePage = (req, res) => {
    const user = req.user;
    const errors = [];

    Profile.findOne({ 'user': user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.push({msg: 'There is no profile for this user'});
                return res.status(404).render('auth/profile', {
                    errors,
                    loggedIn: true
                });
            }

            res.json(profile);
        })
        .catch(err => {
            res.status(404).json(err);
        });
}