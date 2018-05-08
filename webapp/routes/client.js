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
    var sql = 'SELECT * from ClientData';


    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;
        res.render('client', { title: 'Clientes', menu: 'clientes', rows: rows });
    });
});

module.exports = router;

