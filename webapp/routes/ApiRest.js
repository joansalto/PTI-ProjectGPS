var express = require('express');
var conn = require ('../models/connection');
var mysql = require('mysql'),
    connection = mysql.createConnection(
        conn
    );
var router = express.Router();
router.get('/', function(req, res) {
    res.writeHead(301,
        {Location: './'   }
    );
    res.end();

});

/* Falta modificar para el funcionamiento correcto. */
router.post('/', function(req, res) {
    var data = req.body.data;
    var speed = req.body.speed;
    var rpm = req.body.rpm;
    var lvl =  req.body.lvl;
    var time = req.body.time;
    var distance = req.body.distance;
    var idrasp = req.body.idrasp;
    var x = req.body.x;
    var y = req.body.y;
    //console.log(data+" "+speed+" "+rpm+" "+lvl+" "+time+" "+distance);
    connection.query('SELECT clientID FROM CarLocator.Rasps where RaspID = '+idrasp +' and clientID is not null',function(error, result){
        if(error){
            console.log(error);
        }else{
            connection.query('INSERT INTO CarData (ID_rasp, Fecha, RPM, Speed, Fuel_lvl, Runtime, Distance, X, Y, idCliente) VALUES ('+idrasp+', "'+data+'" , '+rpm+', '+speed+','+lvl+', '+time+','+distance+',"'+x+'","'+y+'",'+result[0].clientID+')', function(error, result){
                if(error){
                    console.log(error);
                }else{
                    //console.log(result);
                }
            });
        }
    });
    res.end();



});

module.exports = router;
