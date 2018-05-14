#!/bin/bash

rfkill unblock bluetooth 
/etc/init.d/bluetooth restart
conexion.sh
python connectOBD.py &
