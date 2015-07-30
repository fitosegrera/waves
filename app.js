var request = require('request')
var express = require('express')
var app = express()
var io = require('socket.io')
var serv_io = io.listen(3300)

var lat = 10.4234876
var lon = -75.5648777
var time = 3
var apiKey = '7aa718d134b3cf81740dc21a8a0c0'
var url = 'https://api.worldweatheronline.com/free/v2/marine.ashx?key=' + apiKey + '&tp=' + time + '&tide=yes&format=json&q=' + lat + ',' + lon
var swellDir = []
var swellHeight_m = []
var swellPeriod_secs = []

app.use(express.static(__dirname + '/public'))

function averageData(obj) {
    var sumAll = 0
    for (var i = 0; i < obj.length; i++) {
        sumAll = sumAll + parseFloat(obj[i])
    }
    average = sumAll / obj.length
    return average
}

// setInterval(function() {
//     request(url, function(error, response, body) {
//         if (!error && response.statusCode == 200) {
//             // parse the json result
//             var rawData = JSON.parse(body)
//             var weatherObject = rawData.data.weather[0].hourly

//             for (var i = 0; i < weatherObject.length; i++) {
//                 swellDir.push(weatherObject[i].swellDir)
//                 swellHeight_m.push(weatherObject[i].swellHeight_m)
//                 swellPeriod_secs.push(weatherObject[i].swellPeriod_secs)
//             }
//             var date = rawData.data.weather[0].date
//             var d = averageData(swellDir)
//             var h = averageData(swellHeight_m)
//             var p = averageData(swellPeriod_secs)
//             console.log("date: " + date)
//             console.log(d)
//             console.log(h)
//             console.log(p)

//             var waveData = {
//                 "lat": lat,
//                 "lon": lon,
//                 "date": date,
//                 ""d: d,
//                 "h": h,
//                 "p": p 
//             }

//             serv_io.emit('wave', waveData)
            
//         } else {
//             console.log(error, response.statusCode, body)
//         }
//     })
// }, 20000)

console.log("Server running on port: 3000")
app.listen(3000)
