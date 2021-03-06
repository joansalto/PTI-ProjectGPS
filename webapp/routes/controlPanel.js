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
        var Sesionselected = req.body.sesion;
        var sql = "select * from ClientData where DNI = '" + DNI +"'" ;
        connection.query(sql, function (err,result) {
            if(err) console.log(err);
            var infoCliente = result;
            sql = "SELECT* FROM  CarLocator.CarData WHERE idCliente = "+result[0].ID+" and Sesion = "+Sesionselected+" order by Fecha asc";
            var idCliente = result[0].ID;
            connection.query(sql,idCliente, function (err,result) {
                var fechas, velocidad, rpm, fuel, marcadores;
                var primero = false;
                for(var i = 0; i < result.length; ++i){
                    var date = format(result[i].Fecha);
                    date = date.toString().substr(0,10) +" "+ date.toString().substr(11,8);
                    if(!primero && result[i].X != 0 && result[i].Y != 0) {
                        marcadores  = "[["+result[i].X+","+result[i].Y+"],";
                        primero = true;
                    }
                    else if(result[i].X != 0 && result[i].Y != 0) marcadores  = marcadores + "["+result[i].X+","+result[i].Y+"],";
                    if (i === 0){
                        fechas = "'"+date+"',";
                        velocidad = result[i].Speed +",";
                        rpm = result[i].RPM +",";


                    }
                    else {
                        fechas =fechas + "'"+date+"',";
                        velocidad =velocidad+  +result[i].Speed +",";
                        rpm =rpm+  +result[i].RPM +",";

                    }
                }
                if(fechas != null) fechas = fechas.substr(0,(fechas.length -1));
                else fechas = "";
                if(velocidad != null) velocidad = velocidad.substr(0,(velocidad.length -1));
                else velocidad = "";
                if(rpm != null) rpm = rpm.substr(0,(rpm.length -1));
                else rpm = "";
                if(marcadores != null) marcadores = marcadores.substr(0,(marcadores.length -1))+"]";
                else marcadores = "[[0,0]]";
                sql="SELECT MAX(distance) AS dis, MAX(runtime) AS runtime,Fuel_lvl ,  Sesion  FROM  CarLocator.CarData WHERE  idCliente = "+idCliente+" GROUP BY Sesion";
                connection.query(sql, function (err,result) {
                    var sesion, runtime, distance;
                    for(var i = 0; i < result.length; ++i){
                        if (i === 0){
                            sesion = "'"+result[i].Sesion+"',";
                            runtime = (result[i].runtime/60) +",";
                            fuel = result[i].Fuel_lvl +",";
                        }
                        else {
                            sesion =sesion + "'"+result[i].Sesion+"',";
                            runtime =runtime+ (result[i].runtime/60) +",";
                            fuel =fuel+  +result[i].Fuel_lvl +",";
                        }
                        if(result.length == i+1) distance = result[i].dis;
                    }
                    if(sesion != null) sesion = sesion.substr(0,(sesion.length -1));
                    else sesion = "";
                    if(runtime != null) runtime = runtime.substr(0,(runtime.length -1));
                    else runtime = "";
                    if(fuel != null) fuel = fuel.substr(0,(fuel.length -1));
                    else fuel = "";

                    sql = "SELECT distinct Sesion FROM CarData where  idCliente ="+idCliente;
                    connection.query(sql, function (err,result ) {
                        if(err) console.log(err);
                        res.render(`controlPanel`,{infoCliente:infoCliente, DNI:DNI, datos:result, fechas:fechas, velocidades:velocidad, rpm:rpm, fuel:fuel, sesions:sesion,runtimes:runtime,distance:distance,selectSesions :result, select:Sesionselected, marcadores:marcadores});
                    })

                });
               // res.render(`controlpanel`,{infocliente:infocliente, dni:dni, datos:result, fechas:fechas, velocidades:velocidad, rpm:rpm, fuel:fuel});
            });
        });
    }else {
        res.redirect('/login/');
    }
});


module.exports = router;