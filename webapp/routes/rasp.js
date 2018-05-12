var express = require('express');
var conn = require ('../models/connection');
var mysql = require('mysql'),
    connection = mysql.createConnection(
        conn
    );

var router = express.Router();

router.get('/', function(req, res, next) {
    if(req.session.logueado === 0) {
        res.writeHead(301,
            {Location: './'}
        );
        setTimeout(res.end(), 3000);
    }
    var sql = 'SELECT RaspID,DNI from Rasps left join ClientData on ClientID=ID';


    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;
        var sql2 = 'SELECT DNI from ClientData';
        connection.query(sql2, function(err, DNIS, fields) {
            if (err) throw err;
            res.render('rasp', { title: 'Raspberrys', menu: "raspberry", rows: rows, DNIS:DNIS});
        });
    });
});
// router.get('/DNI', function(req, res, next) {
//     if(req.session.logueado === 0) {
//         res.writeHead(301,
//             {Location: './'}
//         );
//         setTimeout(res.end(), 3000);
//     }
//     var sql = 'SELECT DNI from ClientData';
//
//
//     connection.query(sql, function(err, DNIS, fields) {
//         if (err) throw err;
//         res.render('rasp', { title: 'Raspberrys', menu: "raspberry", DNIS:DNIS });
//
//     });
// });

module.exports = router;

router.post('/desasociar', function(req, res, next){
    var RaspID = req.body.RaspID;
    console.log(RaspID);
    var sql = 'UPDATE Rasps SET ClientID = NULL WHERE RaspID ="'+RaspID+'"';
    connection.query(sql, function (err, result) {
        console.log(sql);
        if (err) throw err;

    });
    res.end();

});
router.post('/asociar', function(req, res, next){
    var RaspID = req.body.RaspID;
    var DNI = req.body.DNI;
    console.log(RaspID);
    console.log(DNI);
    var sql = 'UPDATE Rasps SET ClientID = (SELECT ID FROM ClientData WHERE DNI ="'+DNI+'") WHERE RaspID="'+RaspID+'"';
    connection.query(sql, function (err, result) {
        console.log(sql);
        if (err) throw err;

    });
    res.end();

});
router.post('/eliminar', function(req, res, next){
    var RaspID = req.body.RaspID;
    console.log(RaspID);
    var sql = 'DELETE FROM CarData WHERE ID_rasp ="'+RaspID+'"';
    connection.query(sql, function (err, result) {
        console.log(sql);
        if (err) throw err;

    });
    var sql = 'DELETE FROM Rasps WHERE RaspID ="'+RaspID+'"';
    connection.query(sql, function (err, result) {
        console.log(sql);
        if (err) throw err;

    });

    res.end();

});