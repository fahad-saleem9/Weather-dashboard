const userLocation = document.getElementById("userLocation");
const converter = document.getElementById("converter");
const weatherIcon = document.querySelector(".weatherIcon");
const temperature = document.querySelector(".temperature");
const feelsLike = document.querySelector(".feelsLike");
const description = document.querySelector(".description");
const date = document.querySelector(".date");
const city = document.querySelector(".city");

const HValue = document.getElementById("HValue");
const WValue = document.getElementById("WValue");
const SRValue = document.getElementById("SRValue");
const SSValue = document.getElementById("SSValue");
const CValue = document.getElementById("CValue");
const SLValue = document.getElementById("SLValue");
const PValue = document.getElementById("PValue");

const Forecast = document.querySelector(".foreCast");

function formatUnixTime(dtValue, offset, options = {}) {
    const date = new Date((dtValue + offset) * 1000);
    return date.toLocaleString([], { ...options, timeZone: "UTC" });
}

function getLongFormateDateTime(dtValue, offset, options = {}) {
    return formatUnixTime(dtValue, offset, options);
}

const WEATHER_API_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather?appid=756c5e3d0321dabf90ece2f5747709fb&units=metric&q=';
const FORECAST_API_ENDPOINT = 'https://api.openweathermap.org/data/2.5/forecast?appid=756c5e3d0321dabf90ece2f5747709fb&units=metric&q=';

let currentUnit = "C";

converter.addEventListener("change", (e) => {
    currentUnit = e.target.value === "°F" ? "F" : "C";
    updateWeatherDisplay(currentWeatherData); 
    displayForecast(forecastData); 
});

let currentWeatherData = null;
let forecastData = null;

function findUserLocation() {
    fetch(WEATHER_API_ENDPOINT + userLocation.value)
    .then((response) => response.json())
    .then((data) => {
        if (data.cod !== 200) {
            alert(data.message);
            return;
        }
        currentWeatherData = data;
        updateWeatherDisplay(data);

        // Fetch forecast data
        fetch(FORECAST_API_ENDPOINT + userLocation.value)
        .then((response) => response.json())
        .then((forecast) => {
            forecastData = forecast; 
            displayForecast(forecast); 
        });
    });
}

// Function to update the current weather 
function updateWeatherDisplay(data) {
    city.innerHTML = data.name + ", " + data.sys.country;
    weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
    
    let tempInCelsius = data.main.temp;
    let feelsLikeInCelsius = data.main.feels_like;
  
    let temp = currentUnit === "F" ? celsiusToFahrenheit(tempInCelsius) : tempInCelsius;
    let feelsLike = currentUnit === "F" ? celsiusToFahrenheit(feelsLikeInCelsius) : feelsLikeInCelsius;
    
    temperature.innerHTML = `${Math.round(temp)}°${currentUnit}`;
    feelsLike.innerHTML = `Feels like ${Math.round(feelsLike)}°${currentUnit}`;
    description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> &nbsp;${data.weather[0].description}`;

    const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };
    date.innerHTML = getLongFormateDateTime(data.dt, data.timezone, options);

    HValue.innerHTML = Math.round(data.main.humidity) + "<span>%</span>";
    WValue.innerHTML = Math.round(data.wind.speed) + "<span>ms</span>";
    
    const options1 = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };
    SRValue.innerHTML = getLongFormateDateTime(data.sys.sunrise, data.timezone, options1);
    SSValue.innerHTML = getLongFormateDateTime(data.sys.sunset, data.timezone, options1);

    CValue.innerHTML = data.clouds.all + "<span>%</span>";
    SLValue.innerHTML = data.main.sea_level + "<span>mb</span>";
    PValue.innerHTML = data.main.pressure + "<span>hPa</span>";
}

// Function to display forecas
function displayForecast(forecastData) {
    Forecast.innerHTML = ""; 

    let dayCount = 0;
    forecastData.list.forEach((day, index) => {
        if (index % 8 === 0 && dayCount < 7) {
            const forecastItem = document.createElement("div");
            forecastItem.classList.add("forecast-item");

            const date = new Date(day.dt * 1000);
            const options = { weekday: 'long', month: 'long', day: 'numeric' };
            
            // Convert forecast temperature
            let tempInCelsius = day.main.temp;
            let temp = currentUnit === "F" ? celsiusToFahrenheit(tempInCelsius) : tempInCelsius;

            forecastItem.innerHTML = `
                <h3>${date.toLocaleDateString(undefined, options)}</h3>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}">
                <p>Temp: ${Math.round(temp)}°${currentUnit}</p>
                <p>${day.weather[0].description}</p>
            `;
            Forecast.appendChild(forecastItem);
            dayCount++;
        }
    });
}
function celsiusToFahrenheit(tempCelsius) {
    return (tempCelsius * 9/5) + 32;
}
function fahrenheitToCelsius(tempFahrenheit) {
    return (tempFahrenheit - 32) * 5/9;
}
