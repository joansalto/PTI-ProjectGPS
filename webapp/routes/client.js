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
        if (err) throw console.log("Error SQL");
        res.render('client', { title: 'Clientes', menu: 'clientes', rows: rows });
    });
});








router.post('/alta_cliente', function(req, res, next){


    var dni = req.body.dni;
    var bdni= checkDNI(dni);
    var nombre = req.body.nombre;
    var bnom = checkNombre(nombre);
    var apellido = req.body.apellido;
    var bape = checkApellido(apellido);
    var telefono = req.body.telefono;
    var btel = checkTelefono(telefono);
    var email = req.body.email;
    var bemail = checkEmail(email);

    //DD-MM-YYYY -> YYYY-DD-MM
    var fechaNacimineto = swapData(req.body.fechaNacimiento);
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

    var json = {'estado':ball,'DNI': bdni,'nombre': bnom,'apellido':bape,'telefono':btel,'email':bemail,'data':bdata};


    var values = "'" + dni + "','" + nombre + "','" + apellido + "','" + telefono + "','" + email + "','" + fechaNacimineto +"'";
    var sql = 'INSERT INTO ClientData (DNI, Nombre, Apellido, Telefono, EMAIL, FechaNacimiento) VALUES ('+values+')';
    if(ball==="ok") {

        connection.query(sql, values, function (err, result) {
            if (err) throw console.log("Error SQL");

        });
    }

    //var obj = JSON.parse(json);

    res.send(json);
});


router.post('/buscar_cliente', function(req, res, next){


    var dni = req.body.dni;
    var bdni= checkDNI(dni);
    var nombre = req.body.nombre;
    var bnom = checkNombre(nombre);
    var apellido = req.body.apellido;
    var bape = checkApellido(apellido);
    var telefono = req.body.telefono;
    var btel = checkTelefono(telefono);
    var email = req.body.email;
    var bemail = checkEmail(email);

    //DD-MM-YYYY -> YYYY-DD-MM
    var fechaNacimineto = swapData(req.body.fechaNacimiento);
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

    var json = {'estado':ball,'DNI': bdni,'nombre': bnom,'apellido':bape,'telefono':btel,'email':bemail,'data':bdata};



    var sql = "'UPDATE ClientData SET DNI = '"+bdni+"', Nombre = '"+bnom+"', Apellido = '"+bape+"', Telefono = '"+btel+"', EMAIL = '"+bemail+"', FechaNacimiento ='"+bdata+"' WHERE ID = '"+req.body.id+"'";
    if(ball==="ok") {

        connection.query(sql, function (err, result) {
            if (err) throw console.log("Error SQL");

        });
    }

    //var obj = JSON.parse(json);

    res.send(json);
});


router.post('/baja_cliente', function (req, res, next) {

    var elim = req.body.id;
    var sql = "DELETE FROM ClientData WHERE ID ="+elim;



    connection.query(sql, elim, function (err, result) {
        console.log(sql);
        if (err) throw console.log("Error SQL");

    });
    res.send({'estado':'ok'});
});

router.post('/buscar_cliente', function (req,res,next) {

    var id = req.body.id;
    var sql = "SELECT * FROM ClientData WHERE ID = '"+id+"' ";

    var json = {'estado':ball,'DNI': bdni,'nombre': bnom,'apellido':bape,'telefono':btel,'email':bemail,'data':bdata};

    if(ball==="ok") {

        connection.query(sql, function (err, result) {
            if (err) throw console.log("Error SQL");

        });
    }

    res.send(json);
    

});

router.post('/editar_cliente', function(req, res, next){


    var dni = req.body.dni;
    var bdni= checkDNI(dni);
    var nombre = req.body.nombre;
    var bnom = checkNombre(nombre);
    var apellido = req.body.apellido;
    var bape = checkApellido(apellido);
    var telefono = req.body.telefono;
    var btel = checkTelefono(telefono);
    var email = req.body.email;
    var bemail = checkEmail(email);

    //DD-MM-YYYY -> YYYY-DD-MM
    var fechaNacimineto = swapData(req.body.fechaNacimiento);
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

    var json = {'estado':ball,'DNI': bdni,'nombre': bnom,'apellido':bape,'telefono':btel,'email':bemail,'data':bdata};



    var sql = "'UPDATE ClientData SET DNI = '"+bdni+"', Nombre = '"+bnom+"', Apellido = '"+bape+"', Telefono = '"+btel+"', EMAIL = '"+bemail+"', FechaNacimiento ='"+bdata+"' WHERE ID = '"+req.body.id+"'";
    if(ball==="ok") {

        connection.query(sql, function (err, result) {
            if (err) throw console.log("Error SQL");

        });
    }

    //var obj = JSON.parse(json);

    res.send(json);
});



module.exports = router;
function checkDNI(str){
    if(typeof str != 'string' || str === "") return "Datos incorrectos";
    //Falta comprobar q DNI no esta dentro de BDD
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
    for (var i = 0; i < str.length; i++ ){
        if (str[i] < '0' && str[i] > [9]) return "Telefono no puede contener caracteres no numericos"
    }
    return "ok";
}
function checkEmail(str){
    if(typeof str != 'string' || str === "") return "Datos incorrectos";
    return "ok"
}

function swapData(str){
    var arr0 = str.substr(0,2);
    var arr1 = str.substr(3,2);
    var arr2 = str.substr(6,4);
    return arr2 + "-" + arr0 + "-" + arr1;

}
function swapDataFront(str){
    //YYYY-MM-DD
    var arr0 = str.substr(0,4);
    var arr1 = str.substr(5,2);
    var arr2 = str.substr(8,2);
    return arr1 + "-" + arr2 + "-" + arr0;

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
