#!/bin/bash

rfkill unblock bluetooth 
/etc/init.d/bluetooth restart
rfcomm connect hci0 00:00:00:11:11:11
python connectOBD.py
