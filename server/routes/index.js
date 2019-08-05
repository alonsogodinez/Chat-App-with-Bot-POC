const express = require('express');
const router = express.Router();
const { publishToBotQueue } = require("../services/MQService");
const { isAuthenticated } = require('../middlewares/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  //publishToBotQueue("Test").then(()=> {
    res.redirect('/chat');
  //})

});

router.get('/chat', isAuthenticated, function(req, res) {
    //publishToBotQueue("Test").then(()=> {
    res.render('chat.pug');
    //})
});

router.get('/login', function(req, res, next) {
    //publishToBotQueue("Test").then(()=> {
    res.render('login.pug');
    //})
});

router.get('/sign-up', function(req, res, next) {
    //publishToBotQueue("Test").then(()=> {
    res.render('sign-up.pug');
    //})
});

module.exports = router;
