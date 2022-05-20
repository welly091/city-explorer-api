const axios = require('axios')

//@route GET/weatherbit.io
const getCurrentWeather = async (req, res) =>{
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
}

const getForecastWeather = async (req,res) =>{
    const lat = req.query.lat
    const lon = req.query.lon
    const searchQuery = req.query.name
    try {
        const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHERBIT_API}&lat=${lat}&lon=${lon}`

        let weatherForcastData = await axios.get(url)
        .then((res) =>{
            return res.data
        })
        .catch((error) =>{
            console.log(error.message)
            res.status(400).send("Cannot find the city weather data.")
        })
        let array_forecast = weatherForcastData.data.map(eachObj =>{
            const{low_temp, max_temp, weather:{description}, datetime}= eachObj
            return new Forecast(
                `Low of ${low_temp}, high of ${max_temp} with ${description}`,
                `${datetime}`
            )    
        })
        res.send(array_forecast)
    } catch (error) { 
        //Server error.
        console.log(error.message)
        res.status(500).send('Server error.')
    }
}

class Weather{
    constructor(WindSpeed, temp, humidity, description){
        this.WindSpeed = WindSpeed + " m/s";
        this.temp = temp + " C";
        this.humidity = humidity.toFixed() + "%";
        this.description = description;
    }
}

class Forecast{
    constructor(description, date){
        this.description = description
        this.date = date
    }
}

module.exports = {
    getCurrentWeather,
    getForecastWeather
}
