const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport')
const users = require('../controllers/users')

//fancy way to restructure

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))
//or
// router.get('/register', users.renderRegister)
// router.post('/register', catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.login)

//or
// router.get('/login', users.renderLogin)
// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.login);

router.get('/logout', users.logout);

module.exports = router;