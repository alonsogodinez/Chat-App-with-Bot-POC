const express = require('express');
const router = express.Router();
const { publishToBotQueue } = require("../services/MQService");
const { isAuthenticated } = require('../middlewares/auth');


router.use(isAuthenticated);

router.post('/', function(req, res, next) {
    //publishToBotQueue("Test").then(()=> {
    res.json({});
    //})

});

module.exports = router;
