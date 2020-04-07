//Set variables here



//Setup OpenWeatherMap API:
var APIKey = "695af7151faadd36361885f10ebe27a5";
var city = "Bujumbura,Burundi"
var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
"q=" + city + "&appid=" + APIKey;
console.log(queryURL);

//Setup AJAX call:
$.ajax({
    url: queryURL,
    method: "GET"
})

//Store the retrived data inside an object called "response"
.then(function(response) {
    console.log(response)
})