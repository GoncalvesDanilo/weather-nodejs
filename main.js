const request = require("request")
const dotenv = require("dotenv").config()
const prompt = require('prompt-sync')()

const city = prompt("Search city: ")

main()

function main(){
    geocoding(city)
}

//Finds latitude and longitude using LocationIQ API
function geocoding(city){
    const url = "https://us1.locationiq.com/v1/search.php?key="+ process.env.GEO_API_KEY +"&q="+ city +"&format=json"

    if(!city){
        return console.log("\nPlease enter the name of the city. \n")
    }

    request(url, (error, response, body) => {
        const data = JSON.parse(body)
        
        if(!data[0]){
            return console.error("Error: Couldn't get latitude and longitude. \n")
        }
        lat = (data[0].lat)
        lon = (data[0].lon)

        weather(lat,lon)
    })

}

//Gets weather info from OpenWeather API
function weather(lat,lon){
    const url = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ lon +"&exclude=minutely,hourly,daily&units=metric&appid="+ process.env.WEATHER_API_KEY

    request(url, (error, response, body) => {
        const data = JSON.parse(body)

        if(!data){
            return console.error("Error: Weather information request failed. \n")
        }

        console.log("\n-=Weather in "+ city +"=-")
        console.log(data.current.weather[0].main+" - "+data.current.weather[0].description)
        console.log("\nTemperature: "+ data.current.temp +"°C")
        console.log("Feels like: "+ data.current.feels_like +"°C")
        console.log("Humidity: "+ data.current.humidity +"%")
        console.log("Wind: "+ data.current.wind_speed +"km/h\n")
        if(data.alerts){
            console.log("Alert from "+ data.alerts[0].sender_name+": "+data.alerts[0].event)
            console.log(" -> "+ data.alerts[0].description+"\n\n")
        }
    })
}