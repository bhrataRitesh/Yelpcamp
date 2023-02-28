module.exports.isLoggedIn = (req, res, next) => {
    // console.log("Req user...", req.user);
    // console.log(req.path, req.originalUrl)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next();
}