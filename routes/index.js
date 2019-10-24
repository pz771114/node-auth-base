const express = require('express');
const { ensureAuthed } = require('../config/auth');
const router = express.Router();

//Welcome page
router.get('/',(req, res)=> res.render('welcome'));

//Dashboard page
router.get('/dashboard', ensureAuthed, (req, res)=> res.render('dashboard',{
    name:req.user.name
}));

module.exports = router;