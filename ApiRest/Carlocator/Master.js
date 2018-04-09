// Cargar modulos y crear nueva aplicacion
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // soporte para bodies codificados en jsonsupport
app.use(bodyParser.urlencoded({ extended: true })); // soporte para bodies codificados

//Ejemplo: POST http://localhost:8080/items
app.post('/items', function(req, res) {
    var obj = req.body;
    console.log(obj);
    var data = req.body.data;
    var speed = req.body.speed;
    var rpm = req.body.speed;
    var lvl =  req.body.speed;
    var time = req.body.speed;
    var distance = req.body.speed;
    console.log(data+speed+rpm+lvl+time+distance);

});

var server = app.listen(8080, function () {
    console.log('Server is running..');
});

