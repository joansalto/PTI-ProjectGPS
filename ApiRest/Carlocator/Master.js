// Cargar modulos y crear nueva aplicacion
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // soporte para bodies codificados en jsonsupport
app.use(bodyParser.urlencoded({ extended: true })); // soporte para bodies codificados

//Ejemplo: POST http://localhost:8080/items
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
    console.log(data+" "+speed+" "+rpm+" "+lvl+" "+time+" "+distance);
    res.end();

});


var server = app.listen(80, function () {
    console.log('Server is running..');
});

