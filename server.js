const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// db
const db = require('./config/keys');


// ----------------importing routes------------------------
const indexRoutes = require('./routes/public/index');
const registerRoutes = require('./routes/public/register');
const loginRoutes = require('./routes/auth/login');
const dashboardRoutes = require('./routes/auth/dashboard');
const profileRoutes = require('./routes/auth/profile');
const experienceRoutes = require('./routes/auth/experience');
const educationRoutes = require('./routes/auth/education');
const profilesRoutes = require('./routes/public/profiles');
const postRoutes = require('./routes/auth/post');
const logoutRoutes = require('./routes/auth/logout');



// passpot Config [local config]
require('./config/passport')(passport);


// -------------------- MIDDLEWARES-----------------------
// logs activities and processes on the console
app.use(logger('dev'));
// provides security for express
app.use(helmet());
// serving statci files
app.use('/public', express.static('public'));
// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// view engine
app.set('view engine', 'ejs');
// connect flash
app.use(flash());
// express session
app.use(session({
    secret: 'hiveofassasins',
    resave: false,
    saveUninitialized: true
}));


// global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.post_msg = req.flash('post_msg');
    res.locals.error = req.flash('error');
    next();
});


// passport middleware
app.use(passport.initialize());
app.use(passport.session());





// using routes
app.use('/', indexRoutes);
app.use('/api/users', registerRoutes);
app.use('/api/users', loginRoutes);
app.use('/dev/dashboard', dashboardRoutes);
app.use('/dev/profile', profileRoutes);
app.use('/dev/experience', experienceRoutes);
app.use('/dev/education', educationRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/dev/posts', postRoutes);
app.use('/logout', logoutRoutes);



// the server
mongoose.connect(db.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(db.port, () => {
            console.log('\nconnected to database');
            console.log(`server is running on port ${db.port}\n`);
        });
    })
    .catch(err => {
        console.log(json(err));
    });