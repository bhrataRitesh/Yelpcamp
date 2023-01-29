const express = require('express')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const path = require('path');
const Campground = require('./models/campground')
const ejsMate = require('ejs-mate')



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

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/makecampground', async (req, res) => {
    const camp = new Campground({ title: 'My Backyard', description: 'cheap camping' })
    await camp.save();
    res.send(camp)
})
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
})
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground)
    // res.send(req.body);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground })
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
})

app.put('/campgrounds/:id', async (req, res) => {
    // res.send('It WOrkded')
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})


app.listen(3030, () => {
    console.log('Serving on port 3030')
})