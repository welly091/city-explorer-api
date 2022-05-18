require('dotenv').config();
const Express = require('express');
const cors = require('cors')
const weatherData = require('./data/weather.json')

const app = Express()

app.use(cors())

app.get('/', (req,res) =>{
    //res.send(weatherData.map(w => w.city_name))
    const lat = req.query.lat
    const lon = req.query.lon
    const searchQuery = req.query.name
    try {
        const result = weatherData.find(w => w.city_name===searchQuery)

        //If doesn not find the data we want, return Error.
        if(!result) res.send('Error. Cannot find the city')

        //If city data is found, return an array that contains Forecast objects.
        let array_forecast = []
        result.data.forEach(eachObj =>{
            const{low_temp, max_temp, weather:{description}, datetime}= eachObj
            array_forecast.push(
                new Forecast(
                    `Low of ${low_temp}, high of ${max_temp} with ${description}`,
                    `${datetime}`
                )
            )
        })
        res.send(array_forecast)

    } catch (error) { 
        //Server error.
        console.log(error.message)
        res.send('Server error.')
    }
})

//Forecast class- store 'description' and 'date' 
class Forecast{
    constructor(description, date){
        this.description = description
        this.date = date
    }
}

app.listen(process.env.PORT || 3002)
