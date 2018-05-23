import gps,os

x=1
session = gps.gps("localhost", "2947")
session.stream(gps.WATCH_ENABLE | gps.WATCH_NEWSTYLE)

while x == 1:
	report = session.next()
	if report['class'] == 'TPV':
		if hasattr(report, 'lat'):
			os.system('rm /home/pi/CarLocator/PTI-ProjectGPS/OBD/lat.txt')
			lat = str(report.lat)
			f = open("/home/pi/CarLocator/PTI-ProjectGPS/OBD/lat.txt","w")
			f.write(lat)
			f.close()
		if hasattr(report, 'lon'):
			os.system('rm /home/pi/CarLocator/PTI-ProjectGPS/OBD/lon.txt')
                        lon = str(report.lon)
                        f = open("/home/pi/CarLocator/PTI-ProjectGPS/OBD/lon.txt","w")
                        f.write(lon)
                        f.close()

