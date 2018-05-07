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

router.post('/', function(req, res, next){

    var sql = 'INSERT INTO ClientData VALUE ?'
    var dni = req.dni;
    var nombre = req.nombre;
    var apellido = req.apellido;
    var telefono = req.telefono;
    var email = req.mail;
    var fechaNacimineto = req.fechaNacimiento;

    var values = dni + "," + nombre + "," + apellido + "," + telefono + "," + email + "," + fechaNacimineto;

    //falta hacer la llamada y lo que hara
    connection.query(sql,values, function(err) {
        if (err) throw err;

    });
}


