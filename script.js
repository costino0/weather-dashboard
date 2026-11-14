import { API_KEY } from "./config.js"

const getWeatherBtn = document.querySelector('#get-weather-btn')
const cityInput = document.querySelector('#city-input')
const errorEl = document.querySelector('#error')

async function getWeather(url) {
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error('Could not find that place, please try again')
    }
    return await res.json()
}

function weatherByCoords(lat, lon) {
    return getWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
}

function weatherByCity(city) {
    return getWeather(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`)
}

function renderWeather(data) {
    document.querySelector('#city').textContent = data.name
    document.querySelector('#date').textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    document.querySelector('#temp').textContent = `${Math.round(data.main.temp)}°C`
    document.querySelector('#description').textContent = data.weather[0].description
    document.querySelector('#icon').src = `https://openweathermap.org/payload/api/media/file/${data.weather[0].icon}.png`
    document.querySelector('#feels').textContent = `${Math.round(data.main.feels_like)}°C`
    document.querySelector('#humidity').textContent = `${data.main.humidity}%`
    document.querySelector('#wind').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`
}

async function showWeather(request) {
    errorEl.textContent = ''
    try {
        const data = await request
        renderWeather(data)
    } catch (err) {
        errorEl.textContent = err.message
    }
}

function searchCity() {
    const city = cityInput.value.trim()
    if (city) {
        showWeather(weatherByCity(city))
    }
}

function searchByLocation() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords
            showWeather(weatherByCoords(latitude, longitude))
        },
        (error) => {
            errorEl.hidden = false
            errorEl.textContent = 'Could not get your location'
            console.error(error.message)
        }
    )
}

getWeatherBtn.addEventListener('click', () => {
    if (cityInput.value.trim()) {
        searchCity()
    } else {
        searchByLocation()
    }
})

cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchCity()
    }
})