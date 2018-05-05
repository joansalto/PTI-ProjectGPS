// Cargar modulos y crear nueva aplicacion
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
app.use(bodyParser.json()); // soporte para bodies codificados en jsonsupport
app.use(bodyParser.urlencoded({ extended: true })); // soporte para bodies codificados

var connection = mysql.createConnection({
    host: 'carlocator.cshcpypejvib.us-west-2.rds.amazonaws.com',
    user: 'root',
    password: 'CarLocator',
    database: 'CarLocator'

});
/*connection.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log('Conexion correcta.');
    }
});
connection.end();*/


//Ejemplo: POST http://localhost:80/items
app.post('/items', function(req, res) {
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

    //connection.connect();

    var query = connection.query('INSERT INTO CarData (ID_rasp, Fecha, RPM, Speed, Fuel_lvl, Runtime, Distance, X, Y) VALUES ("0", "'+data+'" , '+rpm+', '+speed+','+lvl+', '+time+','+distance+',"test","test")', function(error, result){
            if(error){
                throw error;
            }else{
                console.log(result);
            }
        }
    );

    //connection.end();*/


    res.end();



});



var server = app.listen(80, function () {
    console.log('Server is running..');
    //connection.connect();

    var query = connection.query('Select 0 AS Test', function(error, result){
            if(error){
                throw error;
            }else{

                console.log(result);
            }
        }
    );

  //-  connection.end();
});

