// One first loading, display the weather and forecast for the last searched city.
var storedCity = JSON.parse(localStorage.getItem("citySearched"));
console.log("storedCity is " + storedCity);

//If the user doesn't have stored data (new user), display weather conditions in for Seattle:
if (storedCity === null) {
  storedCity = "Seattle";
}

APIcall(storedCity);

$(".list-group").prepend(
  "<li class='list-group-item searchedCities'>" + storedCity + "</li>"
);

//Write an onclick function to set the search form to the AJAX call:
$("#clickedButton").on("click", function (event) {
  event.preventDefault();
  var city = $("#citySearch").val();
  console.log("city clicked is " + city);

  // To prevent from making an empty AJAX call, any clicks with no values in the search input shouldn't do anything; prevents from appending boxes on the left aside bar:
  if (city === "") {
    return;
  }
  // if(city === storedCity){return};  //ISSUE 1: Needs to recognize that smashing the city button won't initiate a reseach.

  //Make a AJAX call using the defined variable "city"
  APIcall(city);

  //Send the city searched to Local Storage
  localStorage.setItem("citySearched", JSON.stringify(city));

  //Add a list group item with the recently searched city to the aside on the html
  $(".list-group").prepend(
    "<li class='list-group-item searchedCities'>" + city + "</li>"
  );
});

//onclick for searched cities:

$(".list-group").on("click", function (event) {
  console.log(event.target.innerHTML);
  var asideCity = event.target.innerHTML;
  APIcall(asideCity);
});

//Setup function to make the AJAX calls for defined city: 
function APIcall(city) {
  var APIKey = "695af7151faadd36361885f10ebe27a5";

  //Current Data:
  console.log("Current weather call made for " + city);
  console.log("---------------------")

  var currentqueryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    APIKey; //added "&units=imperial" for Fahrenheit

  //Setup AJAX call to OpenWeatherMaps Current Weather Data API:
  $.ajax({
    url: currentqueryURL,
    method: "GET",
  }).then(function (responseNow) {
    console.log("Current weather response is below");
    console.log(responseNow);

    //City Name:
    var currentCity = responseNow.name;
    console.log("currentCity is: " + currentCity);

    //Converting UNIX timestamp to date in M/DD/YYYY:
    var unix_timestamp = responseNow.dt;
    console.log("unix_timestamp is: " + unix_timestamp);
    var date = new Date(unix_timestamp * 1000);
    console.log("unix date is: " + date);
    var dt = date.getDate();
    var month = date.getMonth() + 1; //Why does this need +1?
    var year = date.getFullYear();
    var dateFormatted = month + "/" + dt + "/" + year;
    console.log("dateFormatted is: " + dateFormatted);

    //Weather Icon:
    var currentIcon = responseNow.weather[0].icon;
    console.log("weather icon code is: " + currentIcon);
    var currentIconURL =
      " https://openweathermap.org/img/w/" + currentIcon + ".png";

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
    console.log("Making call to UV Index API");
    console.log("------------------");

    var queryURLuv =
      "https://api.openweathermap.org/data/2.5/uvi?appid=" +
      APIKey +
      "&lat=" +
      lat +
      "&lon=" +
      lon;
    var uvIndex;
    $.ajax({
      url: queryURLuv,
      method: "GET",
    }).then(function (UVresponse) {
      uvIndex = UVresponse.value;
      console.log("UV index reponse for UV Index API is below: " + UVresponse);
      console.log(UVresponse);

      console.log("UV Index is: " + uvIndex);
      console.log("------------------");

      //After UVIndex API call, we have access to scope of all current weather variables, including UV Index.

      var dataArray = [
        currentCity,
        dateFormatted,
        currentIconURL,
        currentTemp,
        currentHum,
        currentWind,
        uvIndex,
      ];

      //insert data from the collected current weather variables and disply on index.html;
      $("#cityDate").text(dataArray[0] + " (" + dataArray[1] + ")  ");
      $("#icon").attr("src", dataArray[2]);
      $(".cityTemp").html(
        "Temperature: " + dataArray[3] + "&nbsp;" + "<p>&#8457</p>"
      );
      //Took a while to figure out how to add a space between html elements
      $(".cityHum").text("Humidity: " + dataArray[4] + "%");
      $(".cityWindSpeed").text("Wind Speed: " + dataArray[5] + " MPH");
      $(".cityUV").text(dataArray[6]);

      //UV Index color background: use if/else statements to write a function to assign color style class to uvIndex for severity//
      function UVindexing(event) {
        if (event < 3) {
          $(".cityUV").addClass("btn btn-success cityUVstyle");
        } else if (event < 6) {
          $(".cityUV").addClass("btn btn-warning cityUVstyle");
        } else if (event < 8) {
          $(".cityUV").addClass("btn btn-warning orange cityUVstyle");
        } else if (event < 11) {
          $(".cityUV").addClass("btn btn-danger cityUVstyle");
        } else if (event > 11) {
          $(".cityUV").addClass("btn btn-danger purple cityUVstyle");
        }
      }
      UVindexing(dataArray[6]);
    });

    //ForeCasted Data
     //Using OWM One Call API; I realize it has all the previous information in one API call. It seems like instead of 3 API calls, this could be simplified into 2 API calls, this API requires lattitude and longitude still, but gives UV Index...UV Index call may be redundant.

    var queryURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&units=imperial&appid=" +
      APIKey;
      
    //Setup AJAX call to One Call API for forecast data:
    $.ajax({
      url: queryURL,
      method: "GET",
    })

      //Store the retrived data inside an object called "response"
      .then(function (response) {
        console.log("One Call response for forecast data is below");
        console.log(response);

        var forDay = [1, 2, 3, 4, 5];

        //Write a for loop setting variables for each data piece and populate their cards. Since the response is indexed, we can use the for loops index for this:
        for (var d = 0; d < forDay.length; d++) {

          //Start with Date:
          var unix_timestamp = response.daily[d + 1].dt;
          console.log("unix_timestamp is: " + unix_timestamp);
          var date = new Date(unix_timestamp * 1000);
          console.log("unix date is: " + date);
          var dt = date.getDate();
          var month = date.getMonth() + 1; //Why does this need  +1?
          var year = date.getFullYear();
          var dateFormatted = month + "/" + dt + "/" + year;
          console.log("dateFormatted is: " + dateFormatted);

          // //Weather Icon:
          var nextIcon = response.daily[d + 1].weather[0].icon;
          var nextIconURL =
            "https://openweathermap.org/img/w/" + nextIcon + ".png";

          //Forcasted Temperature: comes as 2 sigFigs
          var tempNext = response.daily[d + 1].temp.max;
          console.log("tempNext is " + tempNext);

          //Forecasted Humidity: 0 sigFigs
          var humNext = response.daily[d + 1].humidity;
          console.log(humNext);

          //Place data into each card; classes were designed to match for loop indexing:
          $(".forDate" + d).text(dateFormatted);
          $(".forTemp" + d).html(
            "Temp: " + tempNext + "&nbsp;" + "<div id='fahr'>&#8457</div>"
          );
          $(".forHum" + d).html("<br>" + "Humidity: " + humNext + "%");
          $(".forIcon" + d).attr("src", nextIconURL);

        }

      });
  });
}
