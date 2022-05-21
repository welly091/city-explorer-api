const axios = require('axios')

const getYelpData = async (req, res) =>{
    try {
        let lat = req.query.lat
        let lon = req.query.lon
        let url = `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}&sort_by=best_match`
        let weatherData = await axios.get(url, {
            headers:{
                Authorization: `Bearer ${process.env.YELP_API_KEY}`,
            }
        })
        .then((res) =>{
            return res.data.businesses
        })
        .catch((error) =>{
            console.log(error.message)
            res.status(400).send("Cannot find results.")
        })
        
        let resultArray = weatherData.map(result =>{
            const{name, image_url, price, rating, url} = result
            return new Buss(
                name,
                image_url,
                price,
                rating, 
                url
            )
        })
        res.send(resultArray)
    } catch (error) {
        res.status(500).send("Yelp server error..")
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
