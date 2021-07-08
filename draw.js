// VARIABLES
const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descriptionElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location");
const humityElement = document.querySelector(".humidity-level p");

// WEATHER CONTAINER
const weather = {};
// KELVIN
const KELVIN = 273;
// API KEY
const key = "089797f38b2df6598a51f2f2253173e8";

// SETTING UNITS (CELSIUS)
weather.temperature = {
    units: "celsius"
}

// SETTING UP GEOLOCATION
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "Geolocation is not supported";
}

// FIND USER'S POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// SHOW ERROR
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// SETTING UP API
function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.humidity = Math.floor(data.main.humidity);
        })
        .then(function(){
            displayWeather();
        });
}

// DISPLAYING WEATHER TO UI
function displayWeather(){
    iconElement.innerHTML = `<img src="./img/${weather.iconId}.png"`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`
    descriptionElement.innerHTML = `${weather.description}`;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    humityElement.innerHTML = `Humidity: ${weather.humidity}<span>%</span>`
}

// CHANGING CELSIUS TO FAHRENHEIT 
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// WHEN USER CLICKS ON THE WEATHER VALUE
tempElement.addEventListener('click', function() {
    if(weather.temperature.value === undefined)
        return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius";
    }
});