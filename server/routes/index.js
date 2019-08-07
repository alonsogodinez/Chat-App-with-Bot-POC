const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');

/* GET home page. */
router.get('/', (req, res, next) =>{
  //publishToBotQueue("Test").then(()=> {
    res.redirect('/chat');
  //})

});

router.get('/chat', isAuthenticated, (req, res) => {
    //publishToBotQueue("Test").then(()=> {
    res.render('chat.pug');
    //})
});

router.get('/login', (req, res, next) => {
    res.render('login.pug');
});

router.get('/sign-up', (req, res, next) => {
    res.render('sign-up.pug');
});

module.exports = router;
