//Set variables here

//Setup OpenWeatherMap API: added "&units=imperial" for Fahrenheit
var APIKey = "695af7151faadd36361885f10ebe27a5";
var city = "seattle";

//Current Data:
console.log("Current Weather data for " + city);

var currentqueryURL =
  "https://api.openweathermap.org/data/2.5/weather?" +
  "q=" +
  city +
  "&units=imperial&appid=" +
  APIKey;

//Setup AJAX call to OpenWeatherMaps Current Weather Data API:
$.ajax({
  url: currentqueryURL,
  method: "GET",
})
.then(function (responseNow) {
  console.log(responseNow);

  //City Name:
  var currentCity = responseNow.name;
  console.log("currentCity is: " + currentCity);

  //Converting UNIX timestamp to date:
  var unix_timestamp = responseNow.dt;
  console.log("unix_timestamp is: " + unix_timestamp);
  var date = new Date(unix_timestamp * 1000);
  console.log("unix date is: " + date);
  var dt = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  var dateFormatted = dt + "/" + month + "/" + year;
  console.log("dateFormatted is: " + dateFormatted);

  //Weather Icon:
  var currentIcon = responseNow.weather[0].icon;
  console.log("weather icon code is: " + currentIcon);
  var currentIconURL =
    "http://openweathermap.org/img/w/" + currentIcon + ".png";

  //Current Temp: 1 sigFig
  var currentTemp = responseNow.main.temp.toFixed(1); //toFixed(1) converts from 2 to 1 significant digit
  console.log("currentTemp is " + currentTemp);

  //Current Humidity
  var currentHum = responseNow.main.humidity;
  console.log("currentHum is: " + currentHum);

  //Current Wind Speed: 1 sigFig
  var currentWind = responseNow.wind.speed;
  console.log("currentWind is: " + currentWind);

  //UV Index requires a seperate AJAX query to OWM UV Index API:
  //Lattitude and Longitude of city required to make AJAX call to OWM's UV Index API
  var lat = responseNow.coord.lat;
  var lon = responseNow.coord.lon;
  console.log("Lat & Long is: " + lat + ", " + lon);

  var queryURLuv =
    "http://api.openweathermap.org/data/2.5/uvi?appid=" +
    APIKey +
    "&lat=" +
    lat +
    "&lon=" +
    lon;
  var uvIndex;
  $.ajax({
    url: queryURLuv,
    method: "GET",
  })
  .then(function (UVresponse) {
    console.log(UVresponse);
    uvIndex = UVresponse.value;
    console.log("UV Index is: " + uvIndex);
    //After UVIndex API call, we have access to scope of all variables, including UV Index.

    // We can now put them in an object.
    // var currentData = {
    //   cityNow: currentCity,
    //   dateNow: dateFormatted,
    //   iconNow: currentIconURL,
    //   tempNow: currentTemp,
    //   humNow: currentHum,
    //   windNow: currentWind,
    //   currentUV: uvIndex,
    // };
    // console.log(currentData);

    // //Insert object data into HTML:
    // $("#cityDate").text(currentData.cityNow + " (" + currentData.dateNow + ")");

    // //Insert icon:
    // $("#icon").attr("src", currentData.iconNow);

    // is this done better with an array?

    var dataArray = [
      currentCity,
      dateFormatted,
      currentIconURL,
      currentTemp,
      currentHum,
      currentWind,
      uvIndex,
    ];

    $("#cityDate").text(dataArray[0] + " (" + dataArray[1] + ")  ");
    $("#icon").attr("src", dataArray[2]);
    $(".cityTemp").append(dataArray[3]);
    $(".cityTemp").append("&nbsp;"); //took a while to figure out how to add a space between html elements
    $(".cityTemp").append("<p>&#8457</p>");
    $(".cityHum").append(dataArray[4] + "%");
    $(".cityWindSpeed").append(dataArray[5] + " MPH");
    $(".cityUV").append(dataArray[6]);

    //need to write a function to assign color style class to uvIndex for severity//


    
  });
});

//ForeCasted Data
var queryURL =
  "https://api.openweathermap.org/data/2.5/forecast?q=" +
  city +
  "&units=imperial&appid=" +
  APIKey;
// console.log(queryURL);

//Setup AJAX call:
$.ajax({
  url: queryURL,
  method: "GET",
})

  //Store the retrived data inside an object called "response"
  .then(function (response) {
    console.log(response);
    console.log(response.list[0]);
    console.log(response.list[8]);
    console.log(response.list[16]);
    console.log(response.list[24]);
    console.log(response.list[32]);
    console.log(response.list[39]);

    //Date: Figuring out how to reformat the date
    console.log("current ISO date is: " + response.list[0].dt_txt);
    var dateISO = response.list[0].dt_txt;
    var date = new Date(dateISO);
    var dt = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var dateFormatted = dt + "/" + month + "/" + year;
    console.log("dateFormatted is: " + dateFormatted);

    //Current Temperature: 1 sigFigs
    console.log("current temp is ");

    //Current Humidity: 0 sigFigs

    //Current Wind Speed: 1 sigFig
  });
