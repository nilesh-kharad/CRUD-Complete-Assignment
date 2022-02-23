var express = require('express');
var router = express.Router();

/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index.ejs');
});



router.get('/signupform', function(req, res, next) {
  res.render('signupForm.ejs');
});


router.get('/dashboard', function(req, res, next) {
  res.render('dashboard.ejs');
});

module.exports = router;
