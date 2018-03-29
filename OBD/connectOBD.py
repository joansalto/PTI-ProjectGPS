#!/bin/sh

import obd, os, datetime, time, os
from obd import OBDStatus
from time import time

tiempo = 0
speed = obd.commands.SPEED # select an OBD command (sensor)
rpm = obd.commands.RPM
fuel_status = obd.commands.FUEL_STATUS #Falla por nose que del sensor
fuel_lvl = obd.commands.FUEL_LEVEL
run_time = obd.commands.RUN_TIME
distance = obd.commands.DISTANCE_W_MIL


def comprobar_conexion():
	ahora = datetime.datetime.now()
	if connection.status() == OBDStatus.ELM_CONNECTED :
		print ("[%s] ELM conectado, falta arrancar el coche" %ahora)
		return 0
	elif connection.status() == OBDStatus.NOT_CONNECTED:
		print ("[%s] No conectado" %ahora)
		return -1
	else :
		print ("[%s] Conectado y recogiendo datos!" %ahora)
		return 1

def imprimir_dato(cmd):
	response = connection.query(cmd) # send the command, and parse the response
	print (response.value) # returns unit-bearing values thanks to Pint

connection = obd.OBD() # auto-connects to USB or RF port
estado = comprobar_conexion()
start_time = time()
while (estado == 1):
	end_time = time()
	tiempo = end_time - start_time;
	if tiempo > 10:
		os.system('clear')
		estado = comprobar_conexion()
		if estado != 1:
			connection = obd.OBD()
		if estado == -1:
			ahora = datetime.datetime.now()
			print ("[%s] Conexion perdida" %ahora)
			break
		ahora = datetime.datetime.now()
		print ("[%s]" %ahora)
		imprimir_dato(speed)
		imprimir_dato(rpm)
		imprimir_dato(fuel_status)
		imprimir_dato(fuel_lvl)
		imprimir_dato(run_time)
		imprimir_dato(distance)
		tiempo = 0
		start_time = time()
			
if (estado == -1):
	ahora = datetime.datetime.now()
	print ("[%s] Imposible conectar, finalizando programa" %ahora)
exit 
