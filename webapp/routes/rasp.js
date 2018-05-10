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
        res.render('rasp', { title: 'Raspberrys', menu: "raspberry", rows: rows });
    });
});

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