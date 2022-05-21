'use strict';
const axios = require('axios')
let cache = require('./cache.js');

function getMovie(city) {
    const key = 'weather-' + city;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${city}&language=en-US&page=1`
        
    const movieCasheTime = 1000 * 60 * 60 * 12
    if (cache[key] && (Date.now() - cache[key].timestamp < movieCasheTime)) {
      console.log('Movie Cache hit');
    } else {
      console.log('Movie Cache miss');
      cache[key] = {};
      cache[key].timestamp = Date.now();
      cache[key].data = axios.get(url)
      .then(response =>parseMovie(response))
    }
    return cache[key].data;
  }
  
  function parseMovie(movieData) {
    try {
        let array_movieData = movieData.data.results.map(eachObj =>{
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
      });
      return Promise.resolve(array_movieData);
    } catch (e) {
      return Promise.reject(e);
    }
  }

//Movie Class
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