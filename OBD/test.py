#!/bin/sh


import datetime, time, os, json, requests, logging,sys, csv, os.path
from time import time
import simplejson as json

def writelog(mensaje):
	NOW = datetime.datetime.now()
	f=open("log.txt","a")
	f.write("["+str(NOW)[0:19] + "] "+mensaje+"\n")
	f.close()

def write_csv(ahora, data_speed, data_rpm, data_lvl, data_time, data_distance):
	myFile = open('datosODB.csv', 'a')
	datos = [[str(ahora)[0:19],data_speed,data_rpm, data_lvl, data_time, data_distance]]
	with myFile:
		writer = csv.writer(myFile)
		writer.writerows(datos)
		myFile.close()
		writelog("Datos guardados en local")
		print ("Escritura completa")

def send(ahora, data_speed, data_rpm, data_lvl, data_time, data_distance):
	json_data = {"data": str(ahora)[0:19], "speed": data_speed,"rpm":data_rpm, "lvl":data_lvl, "time":data_time, "distance": data_distance}
	print json_data #comentario
	url = "http://54.149.160.242/items"
	headers = {'Content-type': 'application/json'}
	try:
		r = requests.post(url, data=json.dumps(json_data), headers=headers)
		return 0
	except:
		return -1

def read_and_send():
	#Primero miro si exoiste el fichero para saber si hay datos que enviar.  SI hay datos los leo y envio.
	#En el momento que se corte la comunicacion dejo de leer y elimino el fichero.
	if os.path.isfile("datosODB.csv"): 
		with open('datosODB.csv') as File:
			reader = csv.reader(File, delimiter=',', quotechar=',',quoting=csv.QUOTE_MINIMAL)
			result = -1
			for row in reader:
				result = send(row[0],row[1],row[2],row[3],row[4],row[5]) #enviamos los datos de la fila
				writelog("Enviando datos de local")
				if result == -1:
					File.close()
					break
			if result == 0:
				os.system("rm datosODB.csv")
				writelog("Fichero borrado correctamente.")
				print ("Fichero enviado y borrado")
	else :
		writelog("Sin datos a enviar")
		print("Documento no existente")


def send_data(ahora, data_speed, data_rpm, data_lvl, data_time, data_distance):
	result = send(ahora, data_speed, data_rpm, data_lvl, data_time, data_distance)
	if result == -1: #Hay error por lo que escribirmos en csv.
		write_csv(ahora, data_speed, data_rpm, data_lvl, data_time, data_distance)
	else :
		read_and_send() #Al no haber error leemos si hay archivo y si lo hay enviamos datos.

#######################################MAIN#######################################
sys.tracebacklimit = 0 #Te quita el traceback de los errores.
data_speed = 10
data_rpm = 5
data_lvl = 47
data_time = 58
data_distance = 9 
ahora = datetime.datetime.now()
send_data(ahora,data_speed,data_rpm,data_lvl,data_time, data_distance)
