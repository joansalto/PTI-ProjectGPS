var express = require('express');
var conn = require ('../models/connection');
var format = require('date-format');
var mysql = require('mysql'),
    connection = mysql.createConnection(
        conn
    );

var router = express.Router();


router.get('/', function(req, res) {
    if(req.session.logueado){
        res.redirect('/rasp/');

    }else {
        res.redirect('/login');
    }
});
router.post('/', function(req, res) {
    if(req.session.logueado){
        var DNI = req.body.DNI;
        var sql = "select * from ClientData where DNI = '" + DNI +"'" ;
        console.log(sql);
        connection.query(sql, function (err,result) {
            if(err) console.log(sql);
            var infoCliente = result;
            sql = "SELECT* FROM  CarLocator.CarData WHERE idCliente = "+result[0].ID+" order by Fecha asc";
            connection.query(sql, function (err,result) {
                if(err) console.log(sql);
                var fechas, velocidad, rpm, fuel;
                for(var i = 0; i < result.length; ++i){
                    var date = format(result[i].Fecha);
                    date = date.toString().substr(0,10) +" "+ date.toString().substr(11,8);
                    if (i === 0){
                        fechas = "'"+date+"',";
                        velocidad = result[i].Speed +",";
                        rpm = result[i].RPM +",";
                        fuel = result[i].Fuel_lvl +",";
                    }
                    else {
                        fechas =fechas + "'"+date+"',";
                        velocidad =velocidad+  +result[i].Speed +",";
                        rpm =rpm+  +result[i].RPM +",";
                        fuel =fuel+  +result[i].Fuel_lvl +",";
                    }
                }
                fechas = fechas.substr(0,(fechas.length -1));
                velocidad = velocidad.substr(0,(velocidad.length -1));
                rpm = rpm.substr(0,(rpm.length -1));
                fuel = fuel.substr(0,(fuel.length -1));
                res.render(`controlPanel`,{infoCliente:infoCliente, DNI:DNI, datos:result, fechas:fechas, velocidades:velocidad, rpm:rpm, fuel:fuel});
            });
        });
    }else {
        res.redirect('/login/');
    }
});


module.exports = router;