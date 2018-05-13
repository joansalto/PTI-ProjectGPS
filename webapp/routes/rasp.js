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
    var sql = 'SELECT RaspID,DNI from Rasps left join ClientData on ClientID=ID ORDER BY RaspID';


    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;
        var sql2 = 'SELECT DNI from ClientData';
        connection.query(sql2, function(err, DNIS, fields) {
            if (err) throw err;
            res.render('rasp', { title: 'Raspberrys', menu: "raspberry", rows: rows, DNIS:DNIS});
        });
    });
});

router.post('/anadir_raspberry', function(req, res, next){


    var DNI = req.body.DNI;
    var bDNI= checkDNI(DNI);
    var RaspID = req.body.RaspID;
    var bRaspID = checkRaspID(RaspID);

    var ball = "Datos incorrectos";
    if( bDNI === "ok") {
        if (bRaspID === "ok") {
            ball = "ok";
        }
    }

    var sql_check = 'SELECT RaspID FROM Rasps WHERE RaspID="'+RaspID+'"';
    connection.query(sql_check, function (err, check ,result) {
        console.log(sql_check);

        if (err) throw err;
        if (check.length!=0) {
            ball="Datos incorrectos";
            bRaspID="RaspID no se puede repetir";
        }
        var json = {'estado':ball,'DNI': bDNI,'RaspID': bRaspID};
        console.log(json);
        var sql = 'INSERT INTO Rasps (RaspID,ClientID) VALUES ( "'+RaspID+'",(SELECT ID FROM ClientData WHERE DNI="'+DNI+'") )';
        if(json.estado==="ok") {
            connection.query(sql, function (err, result) {
                console.log(sql);
                if (err) throw err;
            });
        }
        res.send(json);

    });

    //var obj = JSON.parse(json);

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

function checkDNI(str){
    if(typeof str != 'string') return "Datos incorrectos";
    return "ok";
}

function checkRaspID(str){
    if(typeof str != 'string' || str ==="") return "RaspID no puede estar vacia";
    return "ok";
}