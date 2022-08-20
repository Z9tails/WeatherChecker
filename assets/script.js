//set api key for later use
 var APIKey = "0d80cac8b23a08020de2440c32c75ccf"

 var cityInputEl = document.querySelector("#city");
 var saveCityButton = document.querySelector("#search");
 var searchHistoryEl = document.getElementById("searchhistory");
 var currentNameCity = document.querySelector("#currentname");
 var currentCityInformation = document.querySelector("#currentcityinformation");
 var currentCitydetails = document.querySelector("#currentcitydetails");
 var uvConditions = document.querySelector("#uvconditions");
 var fiveDayCardel = document.querySelector("#forecastcard");

 const today = moment().format("L");
 let DateEL = document.querySelector("#date");

 let yourCity;

 var searchCityList = 
        JSON.parse(window.localStorage.getItem("newCity")) ||[];

function saveCity(city) {
    console.log("saveCity function");
    yourCity = city;
    var newCity ={city,};
    searchCityList.push(newCity);
    window.localStorage.setItem("yourCity", JSON.stringify(searchHistoryList));

};



