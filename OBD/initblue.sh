#!/bin/bash

#rfkill unblock bluetooth 
#/etc/init.d/bluetooth restart
/home/pi/CarLocator/PTI-ProjectGPS/OBD/conexion.sh &
python /home/pi/CarLocator/PTI-ProjectGPS/OBD/connectOBD.py &
exit 0