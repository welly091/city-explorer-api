const axios = require('axios')

//@route GET/themoviedb.org
const getMovie = async (req,res) =>{
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

module.exports = getMovie
