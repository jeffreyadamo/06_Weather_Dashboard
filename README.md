# 06 Server-Side APIs: Weather Dashboard

Developers are often tasked with retrieving data from another application's API and using it in the context of their own. Third-party APIs allow developers to access their data and functionality by making requests with specific parameters to a URL. Your challenge is to build a weather dashboard that will run in the browser and feature dynamically updated HTML and CSS.

Use the [OpenWeather API](https://openweathermap.org/api) to retrieve weather data for cities. The documentation includes a section called "How to start" that will provide basic setup and usage instructions. Use `localStorage` to store any persistent data.

## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast
```

The following image demonstrates the application functionality:

![weather dashboard demo](./Assets/06-server-side-apis-homework-demo.png)

## Development Notes:
```
GIVEN a weather dashboard with form inputs

```
### Pseudocoding:


Development began with a rough checklist of creating starting index.html, style.css, and script.js files and then setting references to OpenWeatherMaps and jQuery APIs, BootstrapCDN and FontAwesome CDN.

A sketch was made of how I may go about using Bootsraps grid system to set my columns in accordance to the design. 
![Pseudocode pic](./Assets/PseudocodePic.png)

Appears that Local Storage will be utilized and mulitple API calls may need to occur depending on which one is free, or requires more information to GET specific data.

The UV Index requires a color scale, so looking at what is current standards according to the EPA (https://www.epa.gov/sunsafety/uv-index-scale-0), rules will have be be set to apply different class colors.

## Features

User is greeted with a left aside element with a search form and the current weather data for Seattle. There are cards for a 5 days forecast and an aside with a search form. 
 
The formatting has BootstrapCDN components including a simple Navbar with page title. A container element holds a main element that uses column components to divide the page into 2 main columns at 3/12 & 9/12 size. 

```
WHEN I search for a city
```
The left aside column has search input from BootstrapCDN and search icon from www.fontawesome.com. The $(.button).on("click") function () event handler is listening to initiate an AJAX call to OpenWeatherMaps Current Weather data API. 

```javascript
//Write an onclick function to set the search form to the AJAX call:
$("#clickedButton").on("click", function(event) {
    event.preventDefault();
    console.log("click");
    var city = $("#citySearch").val();

    // To prevent from making an empty AJAX call, any clicks with no values in the search input shouldn't do anything; prevents from appending boxes on the left aside bar:
    if(city === ""){return}; //see Issue 1) below

    //Make a AJAX call using the defined variable "city"
    APIcall(city);
```

The current weather OWM API is called with a query URL incorporating the "city" variable:

```javascript
function APIcall(city){
    var currentqueryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    APIKey;

    //Setup AJAX call to OpenWeatherMaps Current Weather Data API:
    $.ajax({
    url: currentqueryURL,
    method: "GET",
    })
   
```


```
THEN I am presented with current and future conditions for that city and that city is added to the search history
```
Variables are defined out of the response locations for : city name, date, weather icon, temperature, humidity, and wind speed for this AJAX call. We also define variables for lattitude "lat" and longitude "lon" pulled from the response. To define UV Index we had to use another API:

```javascript
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
        uvIndex = UVresponse.value;
```

Another AJAX call to the OWM OneCall API will gather forecasted data:

```javascript
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" +lon+ "&units=imperial&appid="+ APIKey;
        //Setup AJAX call:
        $.ajax({
        url: queryURL,
        method: "GET",
        })
```

Too add the city to the search list we use the "city" variable defined in the onclick event:

```javascript
//Add a list group item with the recently searched city to the aside on the html
    $(".list-group").prepend("<li class='list-group-item searchedCities'>"+city+"</li>")
```

```
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
```
Another onclick event is defined to make a call for the value of the city clicked:

```javascript
//on click for searched cities:

$(".list-group").on("click", function(event) {
    console.log(event.target.innerHTML);
    var asideCity = event.target.innerHTML;
    APIcall(asideCity);
})
```

```
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
```
The UV Index requires a color scale, so looking at what is current standards according to the EPA (https://www.epa.gov/sunsafety/uv-index-scale-0), rules will have be be set to apply different class colors. BootstrapCDN was used to choose success, warning, and danger buttons, but for orange and purple, new CSS style were written and applied. If/else statement was used to set classes to the UV Index:
```javascript
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
```

```
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast
```

## Issues:

### Issue 1) Repeated clicking on search button after value entered will prepend the same city again. I would have thought this following would fix this:

```javascript
// To prevent running anyfurther, any clicks with no values in the search input shouldn't do anything; prevents from appending boxes on the left aside bar:
    if(city === ""){return};
    if(city === storedCity){return};  //ISSUE: Needs to recognize that smashing the city button won't initiate a re-search.
```
![re-search issue](./Assets/re_search.png)

## Review

You are required to submit the following for review:

* The URL of the deployed application.

* The URL of the GitHub repository. Give the repository a unique name and include a README describing the project.

- - -
© 2019 Trilogy Education Services, a 2U, Inc. brand. All Rights Reserved.
