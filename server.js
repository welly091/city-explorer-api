require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios')
const getMovie = require('./modules/movie.js')
const weatherAPI = require('./modules/weather.js')

const app = express()

app.use(cors())

app.get('/weather', weatherAPI.getCurrentWeather);
app.get('/forecast', weatherAPI.getForecastWeather);
app.get('/movie', getMovie);

app.get('*', (req,res) =>{
    res.send('What you requested is not existed...')
})

app.listen(process.env.PORT || 3002)
