#!/bin/bash

rfkill unblock bluetooth 
/etc/init.d/bluetooth restart
history 
rfcomm connect hci0 00:00:00:11:11:11
echo "Conexion correcta!"
sleep 30
exit
