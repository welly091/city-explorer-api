'use strict';
const axios = require('axios')
let cache = require('./cache.js');

function getYelpData(latitude, longitude) {
    const key = 'yelp-' + latitude + longitude;
    const url = `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&sort_by=best_match&categories=restaurants`
    
    const setTime = 1000 * 60 * 60 //One hour
    if (cache[key] && (Date.now() - cache[key].timestamp < setTime)) {
      //Cache => around 2 minutes
      console.log('Yelp Cache hit');
    } else {
      console.log('Yelp Cache miss');
      cache[key] = {};
      cache[key].timestamp = Date.now();
      cache[key].data = axios.get(url,{
        headers:{
            Authorization: `Bearer ${process.env.YELP_API_KEY}`
        }
    })
      .then(response =>parseYelp(response))
    }
    return cache[key].data;
  }
  
  function parseYelp(yelpData) {
    try {
        console.log(yelpData.data.businesses)
        let resultArray = yelpData.data.businesses.map(result =>{
            const{name, image_url, price, rating, url} = result
            return new Buss(
                name,
                image_url,
                price,
                rating, 
                url
            )
        })
      
      return Promise.resolve(resultArray);
    } catch (e) {
      return Promise.reject(e);
    }
  }


class Buss{
    constructor(name, image_url, price, rating, url){
        this.name = name
        this.image_url = image_url
        this.price = price
        this.rating = rating
        this.url = url
    }
}
module.exports=getYelpData
