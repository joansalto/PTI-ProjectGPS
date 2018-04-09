#!/bin/sh

import obd, os, datetime, time, os, json, sys, logging
from obd import OBDStatus
from time import time


tiempo = 0
speed = obd.commands.SPEED # select an OBD command (sensor)
rpm = obd.commands.RPM
fuel_lvl = obd.commands.FUEL_LEVEL
run_time = obd.commands.RUN_TIME
distance = obd.commands.DISTANCE_W_MIL

def init_config():
	obd.logger.removeHandler(obd.console_handler)
	sys.tracebacklimit = 0 #Te quita el traceback de los errores.Comentar para errores

def send_data(ahora, data_speed, data_rpm, data_lvl, data_time, data_distance):
	json_data = {"data": str(ahora), "speed": data_speed,"rpm":data_rpm, "lvl":data_lvl, "time":data_time, "distance": data_distance}
	url = "http://54.149.160.242:80"
	headers = {'Content-type': 'application/json'}
	try:
		r = requests.post(url, data=json.dumps(json_data), headers=headers)
	except:
		print "Fallo de conexion"

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
	#print (response.value) # returns unit-bearing values thanks to Pint
	return response.value


#######################################MAIN#######################################3
init_config()
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
		data_speed = imprimir_dato(speed)
		data_rpm = imprimir_dato(rpm)
		data_lvl = imprimir_dato(fuel_lvl)
		data_time = imprimir_dato(run_time)
		data_distance = imprimir_dato(distance)
		tiempo = 0
		start_time = time()
			
if (estado == -1):
	ahora = datetime.datetime.now()
	print ("[%s] Imposible conectar, finalizando programa" %ahora)
exit 
