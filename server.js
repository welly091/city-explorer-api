'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weather = require('./modules/weather.js');
const movie = require('./modules/movie.js')
const yelp = require('./modules/yelp')

const app = express();
app.use(cors())

app.get('/forecast', weatherHandler);
app.get('/movie', movieHandler);
app.get('/weather', currWeatherHandler);
app.get('/yelp', yelpHandler )


function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather.getFWeather(lat, lon)
  .then(summaries => response.send(summaries))
  .catch((error) => {
    console.error(error);
    response.status(200).send('Sorry. Something went wrong with Weather API!')
  });
}  

function currWeatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather.getCurrWeather(lat,lon)
  .then(summaries => response.send(summaries))
  .catch((error) => {
    console.error(error);
    response.status(200).send('Sorry. Something went wrong with Weather API!')
  });
} 

function movieHandler(request, response) {
  movie(request.query.city)
  .then(res => response.send(res))
  .catch((error) => {
    console.error(error);
    response.status(200).send('Sorry. Something went wrong with Movie API!')
  });
}  

function yelpHandler(request, response) {
  const { lat, lon } = request.query;
  yelp(lat, lon)
  .then(summaries => response.send(summaries))
  .catch((error) => {
    console.error(error);
    response.status(200).send('Sorry. Something went wrong with Yelp.com API!')
  });
}  


app.listen(process.env.PORT, () => console.log(`Server up on ${process.env.PORT}`));