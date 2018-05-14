var express = require('express');
var conn = require ('../models/connection');
var mysql = require('mysql'),
    connection = mysql.createConnection(
        conn
    );

var router = express.Router();

router.get('/', function(req, res, next) {
    if(req.session.logueado){
        res.render('about', { title: 'about', menu:'about' });
    }else{
        res.writeHead(301,
            {Location: '../login'}
        );
        res.end();
    }

});
module.exports = router;