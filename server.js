// Dependencies
var express = require('express');
var http = require('http'); // HTTP 
var axios = require('axios'); // for making http requests

// Current app
var app = express();
var router = express.Router();

// Templating Engine
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

// Initializations
var BASE_API = "http://api.openweathermap.org/data/2.5/";
var API_KEY = "b4aafa28db3c260e9b1256c547534e87";
var API_KEY_URL_PARAM = "&APPID=";
var API_RESPONSE_MODE = "&mode=json";
const hostname = "localhost";
const port = 3000;

// Routes
app.get('/', (req, res) => {
//  res.sendFile(__dirname + '/index.html');
    res.render('weather', { forecastData : "", text: "" })
});

// get forecast weather of a city
app.get('/city', function(req, res) {
    var city = req.query.cityname;
    
    if(req.query.cityname != "" && req.query.cityname != undefined) {
        console.log("cityname is " + city);
        // build API
        var api = BASE_API + "forecast?q=" + city + API_RESPONSE_MODE + API_KEY_URL_PARAM + API_KEY
        console.log("API - " + api);
        
        // Call API to fetch forecast data
        axios.get(api)
            .then(response => {
                console.log("Success - " + response.data.city.name + ", " + response.data.city.country);
                // build the templating data
                res.render('weather', 
                           { forecastData : {
                                list: response.data.list, 
                                city: response.data.city.name, 
                                country: response.data.city.country 
                             },
                            text: ""
                           }
                );
            })
            .catch(error => {
                // Error in finding weather details
                console.error("ERROR : " + error);
                res.render('weather', { text : "Could not fetch weather details for " + city });
            }
        );
    } else {
        // cityname cannot be empty
        console.error("Cityname is empty!");
        res.render('weather', { text : "Please enter a valid city!" });
    }
});

// Server defintion
http.createServer(app).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});