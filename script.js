import { API_KEY } from "./config.js"

const weatherContainer = document.querySelector('#weather-container')

async function fetchWeather(lat, lon) {
    await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        .then(res => res.json())
        .then(data => {
            const icon = data.weather[0].icon
            console.log(data, data.name, data.weather[0].icon)
            weatherContainer.innerHTML = `
                <img src="https://openweathermap.org/payload/api/media/file/${icon}.png">
            `
        })
}

navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords; 
    fetchWeather(latitude, longitude)
  },
  (error) => {
    console.error("Could not get location:", error.message)
  }
)