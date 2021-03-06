#!/bin/sh

import obd, os, datetime, time, os, json, requests, sys, logging,csv,os.path
from obd import OBDStatus
from time import time

########################VARIABLES GLOBALES#########################
url = "http://54.149.160.242/ApiRest"
tiempo = 0
speed = obd.commands.SPEED # select an OBD command (sensor)
rpm = obd.commands.RPM								              #
fuel_lvl = obd.commands.FUEL_LEVEL						          #
run_time = obd.commands.RUN_TIME						          #
distance = obd.commands.DISTANCE_SINCE_DTC_CLEAR				      #
###################################################################

def get_lat():
        f = open("/home/pi/CarLocator/PTI-ProjectGPS/OBD/lat.txt","r")
        lat = f.read()
        f.close()
        return str(lat)[0:-1]

def get_lon():
        f = open("/home/pi/CarLocator/PTI-ProjectGPS/OBD/lon.txt","r")
        lon = f.read()
        f.close()
        return str(lon)[0:-1]
def get_sesion():
	f = open("/home/pi/CarLocator/PTI-ProjectGPS/OBD/sesion.txt","r")
	sesion = f.read()
	sesion = int(sesion)
	f.close()
	writelog("recojo sesion: " + str(sesion))
	nextsesion = str(sesion + 1)
	os.system("echo "+ nextsesion+" > /home/pi/CarLocator/PTI-ProjectGPS/OBD/sesion.txt")
	return sesion

def init_config():
	obd.logger.removeHandler(obd.console_handler)
	sys.tracebacklimit = 0 #Te quita el traceback de los errores.Comentar para errores

def writelog(mensaje):
	NOW = datetime.datetime.now()
	f=open("/home/pi/CarLocator/PTI-ProjectGPS/OBD/log.txt","a")
	f.write("["+str(NOW)[0:19] + "] "+mensaje+"\n")
	f.close()

def write_csv(idrasp,ahora, data_speed, data_rpm, data_lvl, data_time, data_distance,x,y,sesion):
	myFile = open('/home/pi/CarLocator/PTI-ProjectGPS/OBD/datosODB.csv', 'a')
	datos = [[str(idrasp),str(ahora)[0:19],str(data_speed)[0:-4],str(data_rpm)[0:-23],str(data_lvl)[0:-8], str(data_time)[0:-7],str(data_distance)[0:-10],str(x),str(y),str(sesion)]]
	with myFile:
		writer = csv.writer(myFile)
		writer.writerows(datos)
		myFile.close()
		writelog("Datos en local guardados correctamente.")


def send(idrasp,ahora, data_speed, data_rpm, data_lvl, data_time, data_distance,x,y,sesion):
	json_data = {"idrasp": idrasp,"data": str(ahora)[0:19], "speed": str(data_speed)[0:-4],"rpm":str(data_rpm)[0:-23], "lvl":str(data_lvl)[0:-8], "time":str(data_time)[0:-7], "distance": str(data_distance)[0:-10],"x":x,"y":y,"sesion":sesion}
	headers = {'Content-type': 'application/json'}

	url = "http://54.149.160.242/ApiRest"
	try:
		r = requests.post(url, data=json.dumps(json_data), headers=headers)
		return 0
	except:
		return -1

def read_and_send():
	#Primero miro si exoiste el fichero para saber si hay datos que enviar.  SI hay datos los leo y envio.
	#En el momento que se corte la comunicacion dejo de leer y elimino el fichero.
	if os.path.isfile("/home/pi/CarLocator/PTI-ProjectGPS/OBD/datosODB.csv"): 
		with open('/home/pi/CarLocator/PTI-ProjectGPS/OBD/datosODB.csv') as File:
			reader = csv.reader(File, delimiter=',', quotechar=',',quoting=csv.QUOTE_MINIMAL)
			result = -1
			for row in reader:
				result = send(row[0],row[1],row[2],row[3],row[4],row[5],row[6],row[7],row[8],row[9]) #enviamos los datos de la fila
				if result == -1:
					File.close()
					break
			if result == 0:
				os.system("rm /home/pi/CarLocator/PTI-ProjectGPS/OBD/datosODB.csv")
				writelog("Fichero borrado correctamente.")
	else :
		writelog("Sin datos en local")		

def send_data(raspid,ahora, data_speed, data_rpm, data_lvl, data_time, data_distance,x,y,sesion):
	result = send(raspid,ahora, data_speed, data_rpm, data_lvl, data_time, data_distance,x,y,sesion)
	if result == -1: #Hay error por lo que escribirmos en csv.
		write_csv(raspid,ahora, data_speed, data_rpm, data_lvl, data_time, data_distance,x,y,sesion)
	else :
		read_and_send() #Al no haber error leemos si hay archivo y si lo hay enviamos datos.

def comprobar_conexion():
	ahora = datetime.datetime.now()
	if connection.status() == OBDStatus.ELM_CONNECTED :
		print ("[%s] ELM conectado, falta arrancar el coche" %ahora)
		return 0
	elif connection.status() == OBDStatus.NOT_CONNECTED:
		writelog("Estado: No conectado.")
		print ("[%s] No conectado" %ahora)
		return -1
	else :
		writelog("Conectado y recogiendo datos.")
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
raspid = 2;
sesion = get_sesion()
while (estado == 1):
	end_time = time()
	tiempo = end_time - start_time;
	if tiempo > 10:
		estado = comprobar_conexion()
		if estado != 1:
			connection = obd.OBD()
		if estado == -1:
			ahora = datetime.datetime.now()
			print ("[%s] Conexion perdida" %ahora)
			break
		ahora = datetime.datetime.now()
		data_speed = imprimir_dato(speed)
		data_rpm = imprimir_dato(rpm)
		data_lvl = imprimir_dato(fuel_lvl)
		data_time = imprimir_dato(run_time)
		data_distance = imprimir_dato(distance)
		x = get_lat()
		y = get_lon()
		send_data(raspid,ahora,data_speed, data_rpm, data_lvl, data_time, data_distance,x,y,sesion)
		tiempo = 0
		start_time = time()

if (estado == -1):
	ahora = datetime.datetime.now()
	writelog("Imposible conectar, finalizando el programa")
exit