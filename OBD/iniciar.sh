#!/bin/bash

echo 0 > /home/pi/CarLocator/PTI-ProjectGPS/OBD/lat.txt
echo 0 > /home/pi/CarLocator/PTI-ProjectGPS/OBD/lon.txt
python /home/pi/CarLocator/PTI-ProjectGPS/OBD/getgps.py &
/home/pi/CarLocator/PTI-ProjectGPS/OBD/initblue.sh & 
exit 0 