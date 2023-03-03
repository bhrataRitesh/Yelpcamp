if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// console.log(process.env.SECRET)

const express = require('express')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const path = require('path');
const Campground = require('./models/campground')
const ejsMate = require('ejs-mate')
const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError")
const Joi = require('joi')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');


mongoose.set('strictQuery', false)

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then(() => {
    console.log("DataBase connected")
}).catch(e => {
    console.log('ERROR')
    console.log(e)
})
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,

    }
}
app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine('ejs', ejsMate);



app.use((req, res, next) => {
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'birju@gm;ail.com', username: 'birju' })
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})



app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/makecampground', catchAsync(async (req, res) => {
    const camp = new Campground({ title: 'My Backyard', description: 'cheap camping' })
    await camp.save();
    res.send(camp)
}))


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something Went Wrong' } = err;
    if (!err.message) err.message = 'Oh No, Something WEnt wrong!'
    res.status(statusCode).render('error', { err });
    // res.send('Oh Boy, Something went wrong')
})


app.listen(3030, () => {
    console.log('Serving on port 3030')
})