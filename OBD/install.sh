#!/bin/bash

#OBD
apt-get update
apt-get upgrade
pip install obd
apt-get install bluetooth bluez blueman

#GPS
apt-get install pps-tools
apt-get install libcap-dev
apt-get install gpsd gpsd-clients python-gps
apt-get update

cp -vubf ./config.txt /boot/config.txt
cp -vubf ./modules /etc/moduels

#No estoy seguro si esto funciona sin reboot
#reboot
cp -vubf ./gpsd /etc/default/gpsd

sudo gpsd /dev/ttyAMA0 -F /var/run/gpsd-sock
#cgps -s
