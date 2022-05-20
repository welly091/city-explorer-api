const express = require('express')
const axios = require('axios')
const router = express.Router()

//@route GET/weatherbit.io
router.get('/', async(req, res) =>{
    try {
        let lat = req.query.lat
        let lon = req.query.lon
        let url = `https://api.weatherbit.io/v2.0/current?key=${process.env.WEATHERBIT_API}&lat=${lat}&lon=${lon}`
    
        let weatherData = await axios.get(url)
            .then((res) =>{
                return res.data
            })
            .catch((error) =>{
                console.log(error.message)
                res.status(400).send("Cannot find the city weather data.")
            })
        const myweather = new Weather(
            weatherData.data[0].wind_spd, 
            weatherData.data[0].temp,
            weatherData.data[0].rh,
            weatherData.data[0].weather.description    
        )
        res.send(myweather)
    } catch (error) {
        res.status(500).send("Server error..")
    }
})

class Weather{
    constructor(WindSpeed, temp, humidity, description){
        this.WindSpeed = WindSpeed + " m/s";
        this.temp = temp + " C";
        this.humidity = humidity.toFixed() + "%";
        this.description = description;
    }
}

module.exports=router;