// HTML elements ( putting them into variables)
var searchImput=document.getElementById("search");
var searchButton=document.getElementById("searchBTN");
var history=document.getElementById("history");
var cityDashboard=document.getElementById("city-dash");
var cityForecast = document.getElementById("city-forecast");

// JS Variables
var searchHistory=[]


function handleSearch(){
    var city=searchImput.value.replace(" ","+") 
    var cityNoPlus = searchImput.value;
    cityNoPlus = cityNoPlus.charAt(0).toUpperCase() + cityNoPlus.slice(1);
    getGeocode(city, cityNoPlus);
}

function handleClick(){
    var city = this.innerHTML.replace(" ", "+");
    var cityNoPlus = this.innerHTML;
    getGeocode(city, cityNoPlus);
}

function getGeocode(query, cityNoPlus){
    var baseUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${API_KEY}`

    fetch(baseUrl).then(res => {
        return res.json();
    }).then(geoloc => {
        if (!geoloc[0]){
            console.log("Location not found");
        } else {
            getWeather(geoloc[0], cityNoPlus);
        }
    }).catch(err => {
        console.log(`Error: ${err}`);
    });

}

function getWeather(geocode, cityName) {
    var lat = geocode.lat;
    var lon = geocode.lon;
    // var {lat,lon} = geocode;

    var baseUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    
    fetch(baseUrl).then(res => {
        return res.json();
    }).then(weatherData => {
        console.log(weatherData);
        
        if (searchHistory.indexOf(cityName) == -1){
            searchHistory.push(cityName);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        }
        updateHistory();
        
        var uvi = weatherData.daily[0].uvi; 
        var uviBtnColor;

        if (uvi < 3){
            uviBtnColor = "btn-success";
        } else if (uvi < 7) {
            uviBtnColor = "btn-warning";
        } else {
            uviBtnColor = "btn-danger";
        }
        
        var currWeather = weatherData.daily[0];

        cityDashboard.innerHTML=`
        <h2>${cityName} (${moment().format("MMMM Do YYYY")}) <img src="http://openweathermap.org/img/w/${currWeather.weather[0].icon}.png"></h2>
                <p>Temp: ${currWeather.temp.day}°f</p>
                <p>Wind: ${currWeather.wind_speed} mph</p>
                <P>Humidity: ${currWeather.humidity} %</P>
                <p>UV Index: <span class="btn ${uviBtnColor}">${uvi}</span></p>`

        buildFiveDayForecast(weatherData.daily)
    })
}

function buildFiveDayForecast(weather){
    cityForecast.innerHTML = "<h2>Five Day Forecast<h2>"

    for (var i = 1; i <= 5; i++){
        var weatherDiv = document.createElement("div");
        weatherDiv.classList.add("col-md-3");
        weatherDiv.classList.add("bg-dark")
        weatherDiv.classList.add("text-light")
        // weatherDiv.classList.add("border")
        // weatherDiv.classList.add("border-dark")
        weatherDiv.classList.add("rounded")
        weatherDiv.classList.add("mx-2")
        weatherDiv.classList.add("mb-2")
        weatherDiv.classList.add("text-center")

        var date = moment.unix(weather[i].dt).format("dddd MMM Do");

        weatherDiv.innerHTML = `
        <h3>${date}</h3>
        <img src="http://openweathermap.org/img/w/${weather[i].weather[0].icon}.png">
        <p>Temp: ${weather[i].temp.day}°f</p>
        <p>Wind: ${weather[i].wind_speed} mph</p>
        <P>Humidity: ${weather[i].humidity} %</P>`

        cityForecast.appendChild(weatherDiv);
    }
}

function updateHistory(){
    var renderHistory = localStorage.getItem("searchHistory");
    if (renderHistory) {
        renderHistory = JSON.parse(renderHistory);
        searchHistory = renderHistory;
    
        document.getElementById("history").innerHTML=""
        for (var i=0;i < renderHistory.length;i++){
            let btn=document.createElement("button");
            btn.classList.add("btn");
            btn.classList.add("btn-secondary");
            btn.classList.add("btn-lg");
            btn.classList.add("mx-1");
            btn.classList.add("mb-2");
            btn.classList.add("historyBtn");
            btn.innerHTML=`${renderHistory[i]}`;
            document.getElementById("history").appendChild(btn);
        }
    }
}

updateHistory();
searchButton.addEventListener("click",handleSearch);
document.querySelector('.historyBtn').addEventListener("click",handleClick);