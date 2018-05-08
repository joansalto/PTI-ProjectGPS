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

router.post('/alta_cliente', function(req, res, next){

    var sql = 'INSERT INTO ClientData (DNI, Nombre, Apellido, Telefono, EMAIL, FechaNacimiento) VALUES (?)'
    var dni = req.dni;
    var bdni= checkDNI(dni);
    var nombre = req.nombre;
    var bnom = checkNombre(nombre);
    var apellido = req.apellido;
    var bape = checkApellido(apellido);
    var telefono = req.telefono;
    var btel = checkTelefono(telefono);
    var email = req.email;
    var bemail = checkEmail(email);

    //DD-MM-YYYY -> YYYY-DD-MM
    var fechaNacimineto = swapData(req.fechaNacimiento);
    var bdata = isValidData(fechaNacimineto);

    var ball = "Datos incorrectos";
    if( bdni === "ok") {
        if (bnom === "ok") {
            if (bape === "ok") {
                if (btel === "ok") {
                    if (bemail === "ok") {
                        if (bdata === "ok") {
                            ball = "ok";
                        }
                    }
                }
            }
        }
    }

    var json = "{'estado': '"+ball+"','DNI':'"+bdni+"','nombre':'"+bnom+"','apellido':'"+bape+"','telefono':'"+btel+"','email':'"+bemail+"','data':'"+bdata+"'}";


    var values = "'" + dni + "','" + nombre + "','" + apellido + "','" + telefono + "','" + email + "','" + fechaNacimineto +"'";

    if(ball==="ok") {
        connection.query(sql, values, function (err, result) {

            if (err) throw err;

        });
    }
    var obj = JSON.parse(json);

    res.send(obj)
}



function checkDNI(str){
    if(typeof str != 'string' || str === "") return "Datos incorrectos";
    return "ok";
}

function checkNombre(str){
    if(typeof str != 'string' || str === "") return "Datos incorrectos";
    return "ok"
}

function checkApellido(str){
    if(typeof str != 'string' || str === "") return "Datos incorrectos";
    return "ok"

}

function checkTelefono(str){
    if(typeof str != 'string' || str === "") return "Datos incorrectos";
    for (var i = 0; i < str.length(); i++ ){
        if (str[i] < '0' && str[i] > [9]) return "Telefono no puede contener caracteres no numericos"
    }
    return "ok";
}
function checkEmail(str){
    if(typeof str != 'string' || str === "") return "Datos incorrectos";
    return "ok"
}

function swapData(str){
    var arr = str.split("-");
    return arr[2] + "-" + arr[0] + "-" + arr[1];

}

function isValidData(str){
    // STRING FORMAT yyyy-mm-dd
    if(str=="" || str==null){return "Datos incorrectos";}

    // m[1] is year 'YYYY' * m[2] is month 'MM' * m[3] is day 'DD'
    var m = str.match(/(\d{4})-(\d{2})-(\d{2})/);

    // STR IS NOT FIT m IS NOT OBJECT
    if( m === null || typeof m !== 'object'){return "Datos incorrectos";}

    // CHECK m TYPE
    if (typeof m !== 'object' && m !== null && m.size!==3){return false;}

    var ret = "ok"; //RETURN VALUE
    var thisYear = new Date().getFullYear(); //YEAR NOW
    var minYear = 1900; //MIN YEAR

    // YEAR CHECK
    if( (m[1].length < 4) || m[1] < minYear || m[1] > thisYear){ret = "Año fuera de rango";}
    // MONTH CHECK
    if( (m[2].length < 2) || m[2] < 1 || m[2] > 12){ret = "Mes inexistente";}
    // DAY CHECK
    if( (m[3].length < 2) || m[3] < 1 || m[3] > 31){ret = "Dia Inexistente";}

    return ret;
}
