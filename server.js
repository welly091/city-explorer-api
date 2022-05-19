require('dotenv').config();
const Express = require('express');
const cors = require('cors');
const axios = require('axios')
const weatherData = require('./data/weather.json')

const app = Express()

app.use(cors())

//This part is for Lab07
// app.get('/', (req,res) =>{
//     //res.send(weatherData.map(w => w.city_name))
//     const lat = req.query.lat
//     const lon = req.query.lon
//     const searchQuery = req.query.name
//     try {
//         const result = weatherData.find(w => w.city_name===searchQuery)

//         //If doesn not find the data we want, return Error.
//         if(!result) res.status(404).send('404 Error. Cannot find the city')

//         //If city data is found, return an array that contains Forecast objects.
//         let array_forecast = result.data.map(eachObj =>{
//                 const{low_temp, max_temp, weather:{description}, datetime}= eachObj
//                 return new Forecast(
//                     `Low of ${low_temp}, high of ${max_temp} with ${description}`,
//                     `${datetime}`
//                 )    
//             })
//         res.send(array_forecast)

//     } catch (error) { 
//         //Server error.
//         console.log(error.message)
//         res.status(500).send('Server error.')
//     }
// })

app.get('/weather', async(req, res) =>{
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

app.get('/movie', async (req,res) =>{
    try {
        let city = req.query.city
        let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${city}&language=en-US&page=1`
        
        let movieData = await axios.get(url)
            .then((res) =>{
                return res.data.results
            })
            .catch((error) =>{
                res.status(400).send("Cannot find the movie with the city name.")
            })

        let array_movieData = movieData.map(eachObj =>{
            const{title, overview, vote_average, vote_count, backdrop_path,popularity, release_date}= eachObj
            return new Movie(
                title,
                overview,
                vote_average,
                vote_count,
                backdrop_path,
                popularity,
                release_date
            )    
        })
        res.send(array_movieData)
    } catch (error) {
        res.status(500).send('Moive Server Error.')
    }
})

app.get('*', (req,res) =>{
    res.send('What you requested is not existed...')
})

//Forecast class- store 'description' and 'date' 
// class Forecast{
//     constructor(description, date){
//         this.description = description
//         this.date = date
//     }
// }

//CLASS
class Weather{
    constructor(WindSpeed, temp, humidity, description){
        this.WindSpeed = WindSpeed + " m/s";
        this.temp = temp + " C";
        this.humidity = humidity.toFixed() + "%";
        this.description = description;
    }
}

class Movie{
    constructor(title, overview, average_votes, total_votes, image_url, popularity, release_on){
        this.title = title,
        this.overview = overview,
        this.average_votes = average_votes,
        this.total_votes = total_votes,
        this.image_url = "https://image.tmdb.org/t/p/w500"+image_url,
        this.popularity = popularity,
        this.release_on = release_on
    }
}

app.listen(process.env.PORT || 3002)
