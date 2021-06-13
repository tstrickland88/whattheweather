// HTML elements ( putting them into variables)
var searchImput=document.getElementById("search")
var searchButton=document.getElementById("searchBTN")
var history=document.getElementById("history")
var cityDashboard=document.getElementById("city-dash")

// JS Variables
var searchHistory=[]


function handleSearch(){
    var city=searchImput.value.replace(" ","+") 
    var baseUrl=`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
    fetch(baseUrl).then(resp =>{
        return resp.json()
    
    }).then (resp=>{
        console.log(resp)
        //document.getElementById("history").innerHTML= `<button class="btn btn-secondary btn-lg"> ${resp.name}</button>`
        searchHistory.push(resp.name)
        document.getElementById("history").innerHTML=""
        updateHistory()
        var dateUnix=resp.dt

        let cityDiv=document.createElement("div")
        cityDashboard.innerHTML=`
        <h2>${resp.name} (${moment().format("MMMM Do YYYY")}) <img src="https://openweathermap.org/img/w/${resp.weather[0].icon}.png"></h2>
                <p>Temp: ${resp.main.temp}°f</p>
                <p>Wind: ${resp.wind.speed} mph</p>
                <P>Humidity: ${resp.main.humidity} %</P>
                <p>UV Index: <span class="btn btn-success">30</span></p>`
    }) 
}

function updateHistory(){
    for (var i=0;i < searchHistory.length;i++){
        let btn=document.createElement("button") 
        btn.classList.add("btn")
        btn.classList.add("btn-secondary")
        btn.classList.add("btn-lg")
        btn.innerHTML=`${searchHistory[i]}`
        document.getElementById("history").appendChild(btn)

    }
}

searchButton.addEventListener("click",handleSearch)