#!/bin/sh


import datetime, time, os, json, requests, logging,sys 
from time import time
import simplejson as json

def send_data(ahora, data_speed, data_rpm, data_lvl, data_time, data_distance):
	json_data = {"data": str(ahora), "speed": data_speed,"rpm":data_rpm, "lvl":data_lvl, "time":data_time, "distance": data_distance}
	print json_data
	url = "http://54.149.160.242:80"
	headers = {'Content-type': 'application/json'}
	try:
		r = requests.post(url, data=json.dumps(json_data), headers=headers)
	except:
		print "Fallo de conexion"

#######################################MAIN#######################################3
mensaje = "hola"
sys.tracebacklimit = 0 #Te quita el traceback de los errores.
data_speed = 10
data_rpm = 2
data_lvl = 3
data_time = 4
data_distance = 5 
ahora = datetime.datetime.now()
send_data(ahora,data_speed,data_rpm,data_lvl,data_time, data_distance)


	


exit

def say_hola():
	print mensaje

	
start_time= time()
tiempo = 0
n = 0
"""while n < 20000000:
	n = n + 1
	say_hola()
	end_time = time()
	tiempo = end_time - start_time 
	print str(tiempo)
	#os.system('clear')
	if tiempo > 2:
		tiempo = 0
		ahora = datetime.datetime.now()
		
		print ("[%s] " %ahora) + str(n)
		start_time = time()"""
