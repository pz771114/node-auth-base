module.exports = {
    ensureAuthed: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }

        req.flash('error_msg','Please login to access the page');
        res.redirect('/users/login');
    }
}