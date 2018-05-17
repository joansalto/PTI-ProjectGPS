var express = require('express');
var conn = require ('../models/connection');
var mysql = require('mysql'),
    connection = mysql.createConnection(
        conn
    );

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.logueado){
      var totalrasp;
      var totalclient;
      var distance;
      var RPM;
      var time;
      var activos;

      connection.query('SELECT * FROM CarLocator.CarData GROUP BY ID_rasp', function (err, result){
          if (err) throw err;
          else totalrasp = result.length;
          console.log(totalrasp);
          connection.query('UPDATE CarLocator.Estadisticas set rasps = '+totalrasp, function (err, result){
              if (err) console.log(err);
          });

      });
      connection.query('Select sum(d.dis) as dista from (SELECT MAX(Distance) as dis from CarLocator.CarData group by Sesion) d', function (err, result){
          if (err) throw err;
          else distance = result[0].dista;
          connection.query('UPDATE Estadisticas set distance = '+distance+'', function (err, result){
              if (err) console.log(err);
          });

      });
      connection.query('Select avg(RPM) as rpm from CarLocator.CarData', function (err, result){
          if (err) throw err;
          else RPM = result[0].rpm;
         connection.query('UPDATE Estadisticas set rpm = '+RPM+'', function (err, result){
              if (err) console.log(err);
          });
      });

      connection.query('Select sum(r.run) as runt from (SELECT MAX(Runtime) as run from CarLocator.CarData group by Sesion) r', function (err, result){
          if (err) throw err;
          else time = result[0].runt;
          connection.query('UPDATE Estadisticas set time = '+time+'', function (err, result){
              if (err) console.log(err);
          });
      });

      connection.query('SELECT Count(*) as total from Rasps where ClientID is not null', function (err, result){
          if (err) throw err;
          else activos = result[0].total;
          connection.query('UPDATE Estadisticas set activos = '+activos+'', function (err, result){
              if (err) console.log(err);
          });
      });

      connection.query('SELECT count(DNI) as clients from ClientData', function (err, result){
          if (err) throw err;
          else totalclient = result[0].clients;
          connection.query('UPDATE Estadisticas set clients = '+totalclient+'', function (err, result){
              if (err) console.log(err);
          });
      });

      setTimeout(function () {
          connection.query('SELECT * from Estadisticas', function (err, result){
              if (err) throw err;
              else res.render('index', { title: 'Carlocator', menu:'principal', rasps:result[0].rasps, dist: result[0].distance, rpm: result[0].rpm, time: result[0].time, activos:result[0].activos,clients:result[0].clients });

          });

      },3000);


  }else{
   res.redirect("/login");
  }

});

module.exports = router;
