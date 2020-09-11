// Section 1
let userInput = document.getElementById("user-input");
    submitInput = document.getElementById("submit-input");

// Section 2
let latValue = document.getElementById("lat-value"),
    lonValue = document.getElementById("lon-value"),
    sunriseTime = document.getElementById("sunrise"),
    sunsetTime = document.getElementById("sunset"),
    windSpeed = document.getElementById("wind-status-speed"),
    windDirection = document.getElementById("wind-status-direction"),
    visibility = document.getElementById("visibility"),
    visibilityComments = document.getElementById("visibility-comments"),
    humidity = document.getElementById("humidity"),
    humidityComments = document.getElementById("humidity-comments"),
    pressure = document.getElementById("pressure");

// Section 3
let cityOutput = document.getElementById("place-city");
    country = document.getElementById("place-country");
    cityDate = document.getElementById("place-date");
    temp = document.getElementById("weather-today-temperature");
    weatherDescription = document.getElementById("weather-today-comment"),
    weatherIcon = document.getElementById('weather-today-icon');

const spinner = document.getElementById("loader");

const userInputFxn = () => {
  console.log(userInput.value);
  return getUserAsync(userInput.value);
}

async function getUserAsync(city) {
  spinner.style.display = "block";

  try {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=df1c57a802b26db4739891d7dd0c78aa`);
    let data = await response.json();
    console.log(data);
    
    let user = {
      lat: data.coord.lat,
      lon: data.coord.lon,
      sunrise: formatTime(data.sys.sunrise),
      sunset: formatTime(data.sys.sunset),
      speed: data.wind.speed,
      visibility: metreToKm(data.visibility),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      name: data.name,
      country: data.sys.country,
      temp: kelvinToCelsius(data.main.temp),
      dt: timeConverter(data.dt),
      desc: data.weather[0].description
    };

    localStorage.setItem("data", JSON.stringify(user));
    let parsedData = JSON.parse(localStorage.getItem("data"));

    let icon = data.weather[0].icon,
        iconUrl = `http://openweathermap.org/img/w/${icon}.png`;
    weatherIcon.setAttribute('src', iconUrl);

    latValue.innerHTML = parsedData.lat;
    lonValue.innerHTML = parsedData.lon;
    sunriseTime.innerHTML = parsedData.sunrise;
    sunsetTime.innerHTML = parsedData.sunset;
    windSpeed.innerHTML = parsedData.speed;
    visibility.innerHTML = parsedData.visibility;
    humidity.innerHTML = parsedData.humidity;
    pressure.innerHTML = parsedData.pressure;

    cityOutput.innerHTML = parsedData.name;
    country.innerHTML = parsedData.country;
    temp.innerHTML = parsedData.temp;
    cityDate.innerHTML = parsedData.dt;
    weatherDescription.innerHTML = parsedData.desc;

    spinner.style.display= "none";
    
    return data;
  } catch(err) {
    console.log(err);
  } 
}
let yourForm = document.getElementById('your-form');

submitInput.addEventListener('click', userInputFxn, false);
userInput.addEventListener('submit', function (e) {
  e.preventDefault();
  userInputFxn;
});

// Time
function formatTime(unix_timestamp) {
  let date = new Date(unix_timestamp * 1000);
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  let seconds = "0" + date.getSeconds();

  let formattedTime = `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)} GMT + 1`;

  return formattedTime;
}
formatTime(1549312452);

function timeConverter(UNIX_timestamp){
  let a = new Date(UNIX_timestamp * 1000);
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fr', 'Sat'];
  let dayNum = new Date(UNIX_timestamp * 1000).getDay();
  let result = days[dayNum];

  let time = `${result}, ${date} ${month} ${year}`;
  return time;
}


// Temperature converter
function kelvinToCelsius(kelvin) {
  let celsius = kelvin - 273.15;
  return celsius.toFixed(1);
}

// Convert m to km
const metreToKm = (metre) => {
  let km = metre/1000;
  return km.toFixed(1);
}


// Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => console.log(`Service worker: Registered: ${reg.scope}`))
      .catch(err => console.log(`Service worker: Error: ${err}`))
  });
}

