var express = require('express');
var conn = require ('../models/connection');
var md5 = require('md5');
var mysql = require('mysql'),

    connection = mysql.createConnection(
        conn
    );

var router = express.Router();

router.get('/', function(req, res, next) {
    console.log('prueb1');
    res.render('login', {
        correct: '1'});
});
router.post('/', function(req, res, next) {

    var usuario = req.body.user;
    var pass = req.body.password;
    var cifrado = md5(pass);
    connection.query('select * from users where user = "'+usuario+'"  and password = "'+cifrado+'"', function (err, result) {
        if (err) throw err;
        if(result.length > 0) {
            req.session.logueado = 1;
            res.writeHead(301,
                {Location: './'}
            );
            res.end();
        }
        else {
            res.render('login', {
                correct: '0'});
           }
    });


});

router.get('/logout',function (req,res,next) {
    req.session.logueado = 0;
    res.render('login', {
        correct: '1'});



});



module.exports = router;