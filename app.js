var request = require('request')
var express = require('express')
var app = express()
var io = require('socket.io')
var serv_io = io.listen(3300)

var clock = 360
var swellDir = []
var swellHeight_m = []
var swellPeriod_secs = []
var d = 0
var h = 1
var p = 5.0
var lat = 0 
var lon = 0 
var date

var waveData = {
    //"loc": locationData,
    "loc": "caribbean sea",
    "lat": lat,
    "lon": lon,
    "date": date,
    "d": d,
    "h": h,
    "p": p
}

app.get('/wave-h', function(req, res) {
    res.send("$"+ h + ";")
})

app.get('/wave-p', function(req, res) {
    res.send("$"+ p + ";")
})

serv_io.on('connection', function(socket) {
    console.log('a user connected');
    serv_io.emit('wave', waveData)
});

app.use(express.static(__dirname + '/public'))

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function averageData(obj) {
    var sumAll = 0
    for (var i = 0; i < obj.length; i++) {
        sumAll = sumAll + parseFloat(obj[i])
    }
    average = sumAll / obj.length
    return average
}

setInterval(function() {
    lat = getRandomArbitrary(8, 30) // 30 to 8
    lon = getRandomArbitrary(-57, -98) // -98 to -57
    var time = 3
    var apiKey = '7aa718d134b3cf81740dc21a8a0c0'
    var url = 'https://api.worldweatheronline.com/free/v2/marine.ashx?key=' + apiKey + '&tp=' + time + '&tide=yes&format=json&q=' + lat + ',' + lon

    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // parse the json result
            var rawData = JSON.parse(body)
            var weatherObject = rawData.data.weather[0].hourly

            for (var i = 0; i < weatherObject.length; i++) {
                swellDir.push(weatherObject[i].swellDir)
                swellHeight_m.push(weatherObject[i].swellHeight_m)
                swellPeriod_secs.push(weatherObject[i].swellPeriod_secs)
            }
            date = rawData.data.weather[0].date
            d = averageData(swellDir)
            h = averageData(swellHeight_m)
            p = averageData(swellPeriod_secs)

            waveData = {
                "loc": "caribbean sea",
                "lat": lat,
                "lon": lon,
                "date": date,
                "d": d,
                "h": h,
                "p": p
            }
            serv_io.emit('wave', waveData)
            clock = 360
            console.log(waveData)

        } else {
            console.log(error, response.statusCode, body)
        }
    })
}, 400000)

///////////////////////////////////
//////////////server///////////////
///////////////////////////////////
console.log("Server running on port: 3000")
app.listen(3000)
