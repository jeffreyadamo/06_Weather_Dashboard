//Set variables here

//One first loading, want to call up last searched item
// During dev, lets use Seattle:
// var storedCity = "Seattle";

var storedCity = JSON.parse(localStorage.getItem("citySearched"));
console.log(storedCity);

APIcall(storedCity);
$(".list-group").prepend("<li class='list-group-item searchedCities'>"+storedCity+"</li>")

//Write an onclick function to set the search form to the AJAX call:
$("#clickedButton").on("click", function(event) {
    event.preventDefault();
    console.log("click");
    var city = $("#citySearch").val();
    console.log(city);
    APIcall(city);
    $(".list-group").prepend("<li class='list-group-item searchedCities'>"+city+"</li>")

    //Local Storage
    localStorage.setItem("citySearched", JSON.stringify(city));




})

//on click for searched cities:

$(".list-group").on("click", function(event) {
    console.log(event.target.innerHTML);
    var asideCity = event.target.innerHTML;
    APIcall(asideCity);
})
//Setup OpenWeatherMap API: added "&units=imperial" for Fahrenheit

function APIcall(city){
    var APIKey = "695af7151faadd36361885f10ebe27a5";
    // var city = "seattle";

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
    var month = date.getMonth() + 1; //Why does this need  +1?
    var year = date.getFullYear();
    var dateFormatted =  month + "/" + dt + "/" + year;
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

        // All variables are defined. 
        
        // One option is to put all the variables in an object and query the properties.
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

        // //Inserting the object data into HTML is pretty verbose and cumbersome:
        // $("#cityDate").text(currentData.cityNow + " (" + currentData.dateNow + ")");
        // //Insert icon:
        // $("#icon").attr("src", currentData.iconNow);

        // By setting the variables as an array, the index can be called pretty quickly:

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
        $(".cityTemp").html("Temperature: " + dataArray[3] + "&nbsp;" + "<p>&#8457</p>");
        //Took a while to figure out how to add a space between html elements
        $(".cityHum").text("Humidity: " + dataArray[4] + "%");
        $(".cityWindSpeed").text("Wind Speed: " + dataArray[5] + " MPH");
        $(".cityUV").text(dataArray[6]);
        // $(".cityUV").addClass("btn btn-primary cityUVstyle purple")

        //need to write a function to assign color style class to uvIndex for severity//

        function UVindexing(event){
        if (event < 3){
            $(".cityUV").addClass("btn btn-success cityUVstyle");
        } else if (event < 6){
            $(".cityUV").addClass("btn btn-warning cityUVstyle");
        } else if (event < 8){
            $(".cityUV").addClass("btn btn-warning orange cityUVstyle");
        } else if (event < 11){
            $(".cityUV").addClass("btn btn-danger cityUVstyle");
        } else if (event > 11){
            $(".cityUV").addClass("btn btn-danger purple cityUVstyle");
        }}
        UVindexing(dataArray[6]);


       
        });

        //ForeCasted Data
        // var queryURL =
        // "https://api.openweathermap.org/data/2.5/forecast?q=" +
        // city +
        // "&units=imperial&appid=" +
        // APIKey;
        // console.log(queryURL);

        //Using OWM One Call API, I realize it has all the previous information in one API call. It seems like instead of 3 API calls, this could be simplified into one API call. 

        var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" +lon+ "&units=imperial&appid="+ APIKey;

        //Setup AJAX call:
        $.ajax({
        url: queryURL,
        method: "GET",
        })

    //Store the retrived data inside an object called "response"
    .then(function (response) {
        console.log(response);
        console.log(response[1]);
        console.log(response[2]);
        console.log(response[3]);
        console.log(response[4]);
        console.log(response[5]);

        //Date: Figuring out how to reformat the date
        // console.log("current ISO date is: " + response.list[0].dt_txt);
        // var dateISO = response.list[0].dt_txt;
        // var date = new Date(dateISO);
        // var dt = date.getDate();
        // var month = date.getMonth();
        // var year = date.getFullYear();
        // var dateFormatted = month + "/" + dt + "/" + year;
        // console.log("dateFormatted is: " + dateFormatted);

        //In OWM Forecast API, each object property is a 3 hour increase, so 8*3=24 hours from now. Create an array representing the next 5 days in hours of 3:
        var forDay = [1,2,3,4,5];

        for (var d=0 ; d < forDay.length; d++) {

            //Start with Date:
            var dateISO = response.daily[d].dt;
            var date = new Date(dateISO);
            var dt = date.getDate();
            var month = date.getMonth() +1; //again, why +1?
            var year = date.getFullYear();
            var dateFormatted = month + "/" + dt + "/" + year;
            console.log(d)

            // //Weather Icon:
            var nextIcon = response.daily[d].weather[0].icon;
            var nextIconURL =
                "http://openweathermap.org/img/w/" + nextIcon + ".png";


            //Forcasted Temperature: comes as 2 sigFigs
            var tempNext = response.daily[d].temp.max;
            console.log("tempNext is " + tempNext);

            //Forecasted Humidity: 0 sigFigs
            var humNext = response.daily[d].weather.humidity;


            $(".forDate"+d).text(dateFormatted);
            $(".forTemp"+d).html("Temp: "+ tempNext+"&nbsp;" + "<div id='fahr'>&#8457</div>");
            $(".forHum"+d).html("<br>"+"Humidity: " + humNext+ "%");
            $(".forIcon"+d).attr("src", nextIconURL);

        }

        
    
        



        //Current Wind Speed: 1 sigFig
    });
});
}
