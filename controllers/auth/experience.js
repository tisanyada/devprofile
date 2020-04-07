const Profile = require("../../models/Profile");



exports.getAddExperiencePage = (req, res) => {
    res.render('auth/addExperience', {
        loggedIn: true
    });
}


exports.postCreateExperience = (req, res) => {
    const { title, company, location, from, to, current, description } = req.body;
    let errors = [];

    if (!title) {
        errors.push({ msg: 'Title field is required' });
    }

    if (!company) {
        errors.push({ msg: 'Company field is required' });
    }

    // if(description.toString().length < 5 && description !== null){
    //     errors.push({msg: 'Description must have at least five characters'});
    // }


    if (errors.length > 0) {
        res.status(400).render('auth/addExperience', {
            errors,
            loggedIn: true
        });
    } else {
        Profile.findOne({ 'user': req.user.id })
            .then(profile => {
                const newExp = {
                    title,
                    company,
                    location,
                    from,
                    to,
                    current,
                    description
                }

                // Add to exp array
                profile.experience.unshift(newExp);
                // saving the experience added
                profile.save()
                    .then(profile => {
                        res.redirect('/dev/dashboard');
                    })
            })
            .catch(err => {
                res.status(404).json({
                    msg: 'User profile not found',
                    error: err
                });
                console.log(err);
            })
    }

}


exports.getExperienceById = (req, res) => {
    Profile.findOne({ 'user': req.user.id })
        .then(profile => {
            // Get item remove index
            const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id);

            res.json(profile.experience(removeIndex))
            // // splice item out of array
            // profile.experience.findOne({_id: removeIndex})
            //     .then(exp => {
            //         res.json(exp);
            //     })

            // // save
            // profile.save()
            //     .then(() => {
            //         req.flash('success_msg', 'successfully deleted experience info');
            //         res.redirect('/dev/dashboard')
            //     });
        })
        .catch(err => {
            res.status(404).json({
                msg: 'User profile not found',
                error: err
            })
        });
}


exports.postDeleteExperienceInfo = (req, res) => {
    Profile.findOne({ 'user': req.user.id })
        .then(profile => {
            // Get item remove index
            const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id);

            // splice item out of array
            profile.experience.splice(removeIndex, 1);

            // save
            profile.save()
                .then(() => {
                    req.flash('success_msg', 'successfully deleted experience info');
                    res.redirect('/dev/dashboard')
                });
        })
        .catch(err => {
            res.status(404).json({
                msg: 'User profile not found',
                error: err
            })
        });
}