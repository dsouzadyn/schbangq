var express = require('express');
var authmiddleware = require('../middlewares/auth');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET course listings */
router.get('/course',authmiddleware.authenticator, function (req, res, next) {
  res.json({"success": true});
})

module.exports = router;
