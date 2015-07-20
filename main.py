from wsgiref.util import setup_testing_defaults
from wsgiref.simple_server import make_server
import urllib2
import ast
from threading import Thread
import time

apiKey = '7aa718d134b3cf81740dc21a8a0c0'
lat = 10.4234876
lon = -75.5648777
t = 3

url = 'https://api.worldweatheronline.com/free/v2/marine.ashx?key=' + apiKey + '&tp=' + str(t) + '&tide=yes&format=json&q=' + str(lat) + ',' + str(lon)

def getAddress(u):
        print "Requesting data for url:", u
        response = urllib2.urlopen(u)
        print response.read()


def averageData(obj):
        sumAll = 0.0
        for i in obj:
                sumAll = sumAll + float(i)
        average = sumAll/len(obj)
        return average

def request():
        data = urllib2.urlopen(url)
        toParse = ast.literal_eval(data.read())

        date = toParse["data"]["weather"][0]["date"]
        weatherObject = toParse["data"]["weather"][0]["hourly"]

        swellDir = []
        swellHeight_m = []
        swellPeriod_secs = []

        for i in weatherObject:
                swellDir.append(i["swellDir"])
                swellHeight_m.append(i["swellHeight_m"])
                swellPeriod_secs.append(i["swellPeriod_secs"])

        print "date:", date
        print "latitude:", lat
        print "longitude:", lon
        print "direction of waves:", averageData(swellDir)
        print "height of waves:", averageData(swellHeight_m), "meters"
        print "period of waves:", averageData(swellPeriod_secs), "seconds"
        
        data =  (str(date) + '\n' +
                "latitude: " + str(lat) + '\n' +
                "longitude: " + str(lon) + '\n' +
                "direction of waves: " + str(averageData(swellDir)) + '\n' +
                "height of waves: " + str(averageData(swellHeight_m)) + " meters" + '\n' +
                "period of waves: " + str(averageData(swellPeriod_secs)) + " seconds")
        
        return data

def webApp(environ, start_response):
        setup_testing_defaults(environ)
        status = '200 OK'
        headers = [('Content-type', 'text/plain')]
        start_response(status, headers)
        return str(request())

if __name__ == '__main__':
        # th = Thread(target=request)
        # th.daemon = True
        # th.start()
        httpd = make_server('', 8000, webApp)
        print "Serving on port 8000..."
        httpd.serve_forever()