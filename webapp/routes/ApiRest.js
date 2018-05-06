var express = require('express');
var conn = require ('../models/connection');
var mysql = require('mysql'),
    connection = mysql.createConnection(
        conn
    );
var router = express.Router();
router.get('/', function(req, res) {
    res.writeHead(301,
        {Location: 'http://localhost'   }
    );
    res.end();

});

/* Falta modificar para el funcionamiento correcto. */
router.post('/', function(req, res) {
    console.log("Han entrado");
    var obj = req.body;
    console.log(obj);
    var data = req.body.data;
    var speed = req.body.speed;
    var rpm = req.body.rpm;
    var lvl =  req.body.lvl;
    var time = req.body.time;
    var distance = req.body.distance;

//    var idrasp = req.body.idrasp;
//    var x = req.body.x;
//    var y = req.body.y;
    console.log(data+" "+speed+" "+rpm+" "+lvl+" "+time+" "+distance);

    var query = connection.query('INSERT INTO CarData (ID_rasp, Fecha, RPM, Speed, Fuel_lvl, Runtime, Distance, X, Y) VALUES ("0", "'+data+'" , '+rpm+', '+speed+','+lvl+', '+time+','+distance+',"test","test")', function(error, result){
            if(error){
                throw error;
            }else{
                console.log(result);
            }
        }
    );



    res.end();



});

module.exports = router;
