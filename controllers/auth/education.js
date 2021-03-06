const Profile = require("../../models/Profile")





exports.getAddEducationPage = (req, res) => {
    res.render('auth/addEducation', {
        user: req.user,
        loggedIn: true
    });
}


exports.postCreateEducation = (req, res) => {
    const {school, degree, fieldofstudy, from, to, current, description} = req.body;
    let errors = [];

    if(!school){
        errors.push({msg: 'School field is required'});
    }

    if(!degree){
        errors.push({msg: 'Degree/Certificate field is required'});
    }

    if(errors.length > 0){
        res.status(400).render('auth/addEducation',{
            errors,
            loggedIn: true
        });
    } else {
        Profile.findOne({ 'user': req.user.id })
            .then(profile => {
                const newEdu = {
                    school,
                    degree,
                    fieldofstudy,
                    from,
                    to,
                    current,
                    description
                }

                // Add to exp array
                profile.education.unshift(newEdu);
                // saving the experience added
                profile.save()
                    .then(profile => {
                        req.flash('success_msg', 'successfully added new education experience info');
                        res.redirect('/dev/dashboard');
                    });
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


exports.getEducationById = (req, res) => {
    Profile.findOne({ 'user': req.user.id })
        .then(profile => {
            // Get item remove index
            const getIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.edu_id)

            res.render('auth/updateEducation',{
                user: req.user,
                loggedIn: true,
                education: profile.education[getIndex]
            })
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                msg: 'Education not found',
                error: err
            })
        });
}



exports.postUpdateEducation = (req, res)=>{
    const newEdu = {};
    const {school, degree, fieldofstudy, from, to, current, description} = req.body;
    if(school) newEdu.school = school;
    if(degree) newEdu.degree = degree;
    if(fieldofstudy) newEdu.fieldofstudy = fieldofstudy;
    if(current) newEdu.current = current;
    if(from) newEdu.from = from;
    if(to) newEdu.to = to;
    if(description) newEdu.description = description;

    Profile.findOneAndUpdate({'user': req.user.id}, {$set: {education: newEdu } }, {new: true})
        .then(()=>{
            req.flash('success_msg', 'updated education successfully');
            res.redirect('/dev/dashboard');
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                msg: 'Education not updated',
                error: err
            })
        });
}



exports.postDeleteEducationInfo = (req, res) => {
    Profile.findOne({'user': req.user.id})
        .then(profile =>{
            // Get item remove index
            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.edu_id);

            // splice item out of array
            profile.education.splice(removeIndex, 1);

            // save
            profile.save()
                .then(() => {
                    req.flash('success_msg', 'successfully deleted education info');
                    res.redirect('/dev/dashboard')
                });
        })
        .catch(err =>{
            res.status(404).json({
                msg: 'User profile not found',
                error: err
            })
        });
}