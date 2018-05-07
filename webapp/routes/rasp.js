var express = require('express');
var conn = require ('../models/connection');
var mysql = require('mysql'),
    connection = mysql.createConnection(
        conn
    );

var router = express.Router();

router.get('/', function(req, res, next) {

    var sql = 'SELECT RaspID,DNI from Rasps left join ClientData on ClientID=ID';


    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;
        res.render('rasp', { title: 'Raspberrys', rows: rows });
    });
});

module.exports = router;

