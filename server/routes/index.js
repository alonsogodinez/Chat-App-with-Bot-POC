var express = require('express');
var router = express.Router();
const { publishToBotQueue } = require("../services/MQService");

/* GET home page. */
router.get('/', function(req, res, next) {
  publishToBotQueue("Test").then(()=> {
    res.render('index', { title: 'Express' });
  })

});

module.exports = router;
