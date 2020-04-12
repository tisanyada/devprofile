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

    // document.getElementById('current').addEventListener('click', ()=>{
    //     current.innerHTML = true;
    // })
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
            const getIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id)

            res.render('auth/updateExperience',{
                user: req.user,
                loggedIn: true,
                experience: profile.experience[getIndex]
            })
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                msg: 'Experience not found',
                error: err
            })
        });
}


exports.postUpdateExperience = (req, res)=>{
    const newExp = {};
    const {title, company, location, from, to, current, description} = req.body;
    if(title) newExp.title = title;
    if(company) newExp.company = company;
    if(location) newExp.location = location;
    if(current) newExp.current = current;
    if(from) newExp.from = from;
    if(to) newExp.to = to;
    if(description) newExp.description = description;

    Profile.findOneAndUpdate({'user': req.user.id}, {$set: {experience: newExp } }, {new: true})
        .then(()=>{
            req.flash('success_msg', 'updated experience successfully');
            res.redirect('/dev/dashboard');
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                msg: 'Experience not updated',
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