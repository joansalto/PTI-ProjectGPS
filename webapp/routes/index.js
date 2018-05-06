var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.logueado){
      res.render('index', { title: 'Express' });
  }else{
      res.writeHead(301,
          {Location: 'http://localhost/login'}
      );
      res.end();
  }

});

module.exports = router;
