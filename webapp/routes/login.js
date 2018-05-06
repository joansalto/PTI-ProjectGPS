var express = require('express');
var conn = require ('../models/connection');
var mysql = require('mysql'),
    connection = mysql.createConnection(
        conn
    );

var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('login');
});
router.post('/', function(req, res, next) {
    var usuario = req.body.user;
    var pass = req.body.password;
    console.log("usuario: " + usuario);
    console.log("password: " + pass);
    connection.query
    res.end();
});

module.exports = router;