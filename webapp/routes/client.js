var express = require('express');
var conn = require ('../models/connection');
var mysql = require('mysql'),
    connection = mysql.createConnection(
        conn
    );

var router = express.Router();

router.get('/', function(req, res, next) {

    var sql = 'SELECT * from ClientData';


    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;
        res.render('client', { title: 'Client', rows: rows });
    });
});

module.exports = router;

