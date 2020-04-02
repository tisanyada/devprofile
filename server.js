const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

// db
const db = require('./config/keys');


// ----------------importing routes------------------------
const indexRoutes = require('./routes/public/index');
const registerRoutes = require('./routes/public/register');
const loginRoutes = require('./routes/auth/login/login');
const profileRoutes = require('./routes/auth/profile/profile');
const postRoutes = require('./routes/auth/post/post');


// -------------------- MIDDLEWARES-----------------------
// logs activities and processes on the console
app.use(logger('dev'));
// provides security for express
app.use(helmet());
// serving statci files
app.use('/public', express.static('public'));
// body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// view engine
app.set('view engine', 'ejs');
// passport middleware
app.use(passport.initialize());

// passpot Config [jwt config]
require('./config/passport')(passport);


// using routes
app.use('/api/users', indexRoutes);
app.use('/api/users', loginRoutes);
app.use('/api/users', registerRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postRoutes);



// the server
mongoose.connect(db.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        app.listen(db.port, ()=> {
            console.log('\nconnected to database');
            console.log(`server is running on port ${db.port}\n`);
        });
    })
    .catch(err =>{
        console.log(json(err));
    });