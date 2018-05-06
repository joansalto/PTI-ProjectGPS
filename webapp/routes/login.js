var express = require('express');
var conn = require ('../models/connection');
var md5 = require('md5');
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
    var cifrado = md5(pass);
    connection.query('select * from users where user = "'+usuario+'"  and pass = "'+cifrado+'"', function (err, result) {
        if (err) throw err;
        console.log(result);
        if(result.length > 0) {
            req.session.logueado = 1;
        }
    });
    if (req.session.logueado){
        /*res.writeHead(301,
            {Location: 'http://localhost/menu'}
        );
        res.end();
       */
        console.log('logueado con exito');

    }
    else { console.log("Tu puta mae guea")}


    res.end();

});

module.exports = router;