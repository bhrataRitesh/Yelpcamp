const express = require('express')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const path = require('path');
const Campground = require('./models/campground')
const ejsMate = require('ejs-mate')
const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError")
const Joi = require('joi')
const { campgroundSchema } = require('./schemas.js')



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

app.engine('ejs', ejsMate);


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }

}




app.get('/', (req, res) => {
    res.render('home')
})

app.get('/makecampground', catchAsync(async (req, res) => {
    const camp = new Campground({ title: 'My Backyard', description: 'cheap camping' })
    await camp.save();
    res.send(camp)
}))
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);

    const campground = new Campground(req.body.campground)
    // res.send(req.body);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)

}))
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground })
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    // res.send('It WOrkded')
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
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