import gps
import json


def get_gps():

	session = gps.gps("localhost", "2947")
	session.stream(gps.WATCH_ENABLE | gps.WATCH_NEWSTYLE)

	report = session.next()

	if report['class'] == 'TPV':
		if hasattr(report, 'lat'):
			alt_gps = str(report.lat)
		if hasattr(report, 'lon'):
			lon_gps = str(report.lon)

	res = {'alt':alt_gps, 'lon':lon_gps}
	return json.dumps(res)
