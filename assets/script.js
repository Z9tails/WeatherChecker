//set api key
var APIKey = "0d80cac8b23a08020de2440c32c75ccf";

//current date set though moment.js
const today = moment().format("L");
let DateEL = document.querySelector("#current-date");

var cityInputEL = document.querySelector("#searchCity");
var saveCityButton = document.querySelector("#citySearchBtn");
var currentNameCity = document.querySelector("#currentnamedcity");
var cityDetailEL = document.querySelector("#cityDetail");
var currentCity = document.querySelector("#currentcity");
var citySearchHistoryEl = document.getElementById("citySearchHistory");
var fiveDayForecastCardEl = document.querySelector("#forecast");
var uvIndex = document.querySelector("#uvIndexCurrent");
//create object to pass through function
let theCity;

//local storage
var citySearchHistoryList =
  JSON.parse(window.localStorage.getItem("newCity")) || [];

//save city object
function saveCity(city) {
  //get value from input box
  console.log("saveCity function");
  theCity = city;
  var newCity = {
    city,
  };
  citySearchHistoryList.push(newCity);
  window.localStorage.setItem("newCity", JSON.stringify(citySearchHistoryList));
}

//display search history of cities
function displaycitySearchHistory() {
  console.log("displaycitySearchHistory");

  //display on page
  citySearchHistoryEl.textContent = "";
  citySearchHistoryList.forEach(function ({ city }) {
    //create li tag
    let cityButtonEl = document.createElement("button");
    cityButtonEl.setAttribute("class", "list-group-item");
    cityButtonEl.setAttribute("data-id", `${city}`);
    cityButtonEl.textContent = city;
    citySearchHistoryEl.appendChild(cityButtonEl);
  });
}

//saves search history to local storage
saveCityButton.addEventListener("click", function () {
  //get cit from input
  var cityInput = cityInputEL.value.trim();
  if (cityInput === "") {
    return;
  }
  saveCity(cityInput);
  displaycitySearchHistory();
  fetchCurrentCityWx(cityInput);
});

//search history selection
citySearchHistoryEl.addEventListener("click", function (event) {
  event.preventDefault();
  console.log(event.target.dataset.id);
  fetchCurrentCityWx(event.target.dataset.id);
});
displaycitySearchHistory();

//current city fetch call
function fetchCurrentCityWx(city) {
  console.log(city);
  var currentWeatherQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`;
  fetch(currentWeatherQueryURL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      return data.coord;
    })
    .then(function (coord) {
      console.log(coord);
      var oneCallQueryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&units=imperial&appid=${APIKey}`;
      return fetch(oneCallQueryURL);
    })
    .then(function (res) {
      return res.json();
    })
    .then(function (weather) {
      console.log(weather);
      displayCurrentCityWeather(weather.current, city);
      displayFivedayForecast(weather.daily.slice(1, 6));
    })
    .catch(function (err) {
      console.error(err);
    });
}

//current weather, humidity, temperature, name, date, icon, wind speed, uv index display
function displayCurrentCityWeather(currentWeather, city) {
  console.log(currentWeather);
  let theCity = city;
  cityDetailEL.textContent = "";
  currentCity.textContent = theCity + " " + "(" + today + ")";

  //name
  var cityTitle = document.createElement("h2");
  cityTitle.textContent = theCity + " " + "(" + today + ")";
  cityDetailEL.appendChild(cityTitle);

  //wind
  var windSpeedEl = document.createElement("p");
  windSpeedEl.textContent = "Wind Speed: " + currentWeather.wind_speed + " MPH";
  cityDetailEL.appendChild(windSpeedEl);

  //humidity
  var humidityEL = document.createElement("p");
  humidityEL.textContent = "Humidity: " + currentWeather.humidity + " %";
  cityDetailEL.appendChild(humidityEL);

  //temp
  var temp = document.createElement("p");
  temp.textContent = "Temperature: " + currentWeather.temp + " °F";
  cityDetailEL.appendChild(temp);

  //uvi
  var uvIndexEL = document.createElement("p");
  uvIndexEL.textContent = "UV index: " + currentWeather.uvi;
  uvIndexEL.classList.add("uvIndexCurrent");
  cityDetailEL.appendChild(uvIndexEL);
  if (currentWeather.uvi < 3) {
    uvIndexEL.setAttribute("style", "background-color: green");
  } else if (currentWeather.uvi > 2 && currentWeather.uvi < 6) {
    uvIndexEL.setAttribute("style", "background-color: yellow; color: black");
  } else {
    uvIndexEL.setAttribute("style", "background-color: red");
  }

  //weather
  var weatherHolder = currentWeather.weather;
  console.log(weatherHolder[0].description);

  //icon
  console.log(`https://openweathermap.org/img/w/${weatherHolder[0].icon}.png`);
  var iconUrl = `https://openweathermap.org/img/w/${weatherHolder[0].icon}.png`;
  var weatherIconEl = document.createElement("img");
  weatherIconEl.setAttribute("src", iconUrl);
  weatherIconEl.setAttribute("alt", weatherHolder[0].description);
  weatherIconEl.classList.add("current_weather_icon");
  cityDetailEL.appendChild(weatherIconEl);
}

//display 5day forecast

function displayFivedayForecast(dailyWeather) {
  console.log(dailyWeather);
  console.log(dailyWeather[0].weather);
  fiveDayForecastCardEl.innerHTML = "";

  for (i = 0; i < dailyWeather.length; i++) {
    //future date
    var fiveDayForecastsForwardEL = new moment().add(i + 1, "day").format("L");
    let newDateEL = document.createElement("p");
    newDateEL.textContent = fiveDayForecastsForwardEL;

    //wind speed
    var windSpeedEl = document.createElement("p");
    windSpeedEl.textContent =
      "Wind Speed: " + dailyWeather[i].wind_speed + " MPH";

    //humidity
    var humidityEL = document.createElement("p");
    humidityEL.textContent = "Humidity: " + dailyWeather[i].humidity + " %";

    //temp as to have tempHolder because it has a few things listed in it
    var temp = document.createElement("p");
    var tempHolder = dailyWeather[i].temp;
    temp.textContent = "Temperature: " + tempHolder.day + " °F";

    //weather
    var weatherHolder = dailyWeather[i].weather;
    console.log(weatherHolder[0].description);

    //icon
    console.log(
      `https://openweathermap.org/img/w/${weatherHolder[0].icon}.png`
    );
    var iconUrl = `https://openweathermap.org/img/w/${weatherHolder[0].icon}.png`;
    var weatherIconEl = document.createElement("img");
    weatherIconEl.setAttribute("src", iconUrl);
    weatherIconEl.setAttribute("alt", weatherHolder[0].description);
    weatherIconEl.classList.add("weather_icon");

    //create a card
    var newCard = createDailyWeather(
      newDateEL,
      windSpeedEl,
      weatherIconEl,
      humidityEL,
      temp
    );

    fiveDayForecastCardEl.appendChild(newCard);
  }
}

function createDailyWeather(
  dateEl,
  windSpeedEl,
  weatherIconEl,
  humidityEL,
  tempEl
) {
  var cardDay = document.createElement("div");
  cardDay.setAttribute("class", "card_body");

  // append to this day's info to new div
  cardDay.append(dateEl, windSpeedEl, weatherIconEl, humidityEL, tempEl);

  //append this card to where it needs to go
  return cardDay;
}
