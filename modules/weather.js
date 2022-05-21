'use strict';
const axios = require('axios')
let cache = require('./cache.js');

function getFWeather(latitude, longitude) {
  const key = 'weather-' + latitude + longitude;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHERBIT_API}&lang=en&lat=${latitude}&lon=${longitude}&days=5`;
  
  const setTime = 1000 * 60 * 60 //One hour
  if (cache[key] && (Date.now() - cache[key].timestamp < setTime)) {
    //Cache => around 2 minutes
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url)
    .then(response =>parseWeather(response))
  }
  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.data.map(day => {
      return new Weather(day.weather.description, day.datetime);
    });
    console.log(weatherSummaries)
    
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

function getCurrWeather(latitude, longitude) {
  const key = 'currweather-' + latitude + longitude;
  const url = `https://api.weatherbit.io/v2.0/current?key=${process.env.WEATHERBIT_API}&lat=${latitude}&lon=${longitude}`;
  
  if (cache[key] && (Date.now() - cache[key].timestamp < 300000)) {
    //Cache => around 2 minutes
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url)
    .then(response =>parseCurrWeather(response))
  }
  return cache[key].data;
}

function parseCurrWeather(weatherData) {
  try {
    const currWeatherSummaries = new CurrentWeather(
      weatherData.data.data[0].wind_spd, 
      weatherData.data.data[0].temp,
      weatherData.data.data[0].rh,
      weatherData.data.data[0].weather.description    
  )
    
    return Promise.resolve(currWeatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Weather {
  constructor(description, date) {
    this.description = description
    this.date = date
  }
}

class CurrentWeather{
  constructor(WindSpeed, temp, humidity, description){
      this.WindSpeed = WindSpeed + " m/s";
      this.temp = temp + " C";
      this.humidity = humidity.toFixed() + "%";
      this.description = description;
  }
}

module.exports = {
  getFWeather,
  getCurrWeather
};