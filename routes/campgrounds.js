const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

const Campground = require('../models/campground')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

const multer = require('multer');
const { storage } = require('../cloudinary')
// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage });

//fancy way to restructure
router.route('/')  //code 01
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send('It worked!')
// })
//or
// router.get('/', catchAsync(campgrounds.index)) //code 01
router.get('/new', isLoggedIn, campgrounds.renderNewForm)
// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground)) //code 01

router.route('/:id')  //code 02
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

// router.get('/:id', catchAsync(campgrounds.showCampground));   //code 02

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds. updateCampground))  //code 02

// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)) //code 02

module.exports = router;