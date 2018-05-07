#!/bin/bash

#OBD
apt-get update
apt-get upgrade
curl -O https://bootstrap.pypa.io/get-pip.py
python get-pip.py
pip install obd
pip install requests
pip install simplejson
apt-get install bluetooth bluez blueman

#GPS
#apt-get install pps-tools
#apt-get install libcap-dev
#apt-get install gpsd gpsd-clients python-gps

#cp -vubf ./config.txt /boot/config.txt
#cp -vubf ./modules /etc/modules

#No estoy seguro si esto funciona sin reboot
#reboot
#cp -vubf ./gpsd /etc/default/gpsd
#sudo gpsd /dev/ttyAMA0 -F /var/run/gpsd-sock
#cgps -s
