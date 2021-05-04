// Variable declaration
var date = $("#date");
var dateValue = moment().format("(M/D/YYYY)");
var cityHistory = [];

// Setting the date as text value
date.text(dateValue);

// Declaring the weather API search key
var myKey = "06e368149eaec718bf08b835480c028b";

// Adding an event listener to the search button
$("#search").on("click", getCityData);

// Function declaration that connects to API, grabs data, and displays data
function getCityData() {
  // Grabbing user input
  var cityName = $("#userInput").val();

  // Finding the city based off of user input through API
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=imperial&appid=" +
    myKey;

  // AJAX method for connecting to API. Returns a promise which is resolved
  $.ajax({
    url: requestUrl,
    method: "GET",
  })
    // Resolved promise condition is executed
    .then(function (response) {
      // Grabbing the latitude and longitude of the city to put in next API
      var lat = response.coord.lat;
      var lon = response.coord.lon;
      var requestUrl1 =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=imperial&appid=" +
        myKey;

      // Putting the lat and long variables into API to get data we need for site
      $.ajax({
        url: requestUrl1,
        method: "GET",
      }).then(function (response) {
        // Displaying current temp
        temp = response.current.temp;
        $("#temperature").text(temp.toFixed(2) + "°F");

        // Displaying current wind
        wind = response.current.wind_speed;
        $("#wind").text(wind.toFixed(2) + "MPH");

        // Displaying current humidity
        humidity = response.current.humidity;
        $("#humidity").text(humidity + " %");

        // Displaying current index
        uvIndex = response.current.uvi;

        // Adding color code that indicastes uvIndex conditions
        if (parseInt(uvIndex) >= 6) {
          $("#uvIndex").text(uvIndex).css({
            "background-color": "red",
            padding: "2.5px 7.5px",
            "border-radius": "3px",
          });
          $("#cityData").css({ border: "solid red 2px", margin: "10px" });
        } else if (parseInt(uvIndex) >= 3 && parseInt(uvIndex) < 6) {
          $("#uvIndex").text(uvIndex).css({
            "background-color": "green",
            padding: "2.5px 7.5px",
            "border-radius": "3px",
          });
          $("#cityData").css({ border: "solid green 2px", margin: "10px" });
        } else {
          $("#uvIndex").text(uvIndex).css({
            "background-color": "yellow",
            padding: "2.5px 7.5px",
            "border-radius": "3px",
          });
          $("#cityData").css({ border: "solid yellow 2px", margin: "10px" });
        }

        // Adding the icons
        iconToday = response.current.weather[0].icon;
        var findIconToday = new Image(50, 50);
        findIconToday.src =
          "http://openweathermap.org/img/wn/" + iconToday + "@2x.png";

        // Making an array of object for next 5 days
        var days = response.daily;
        days.shift();

        // Displaying dates
        function postForecastDates() {
          var dates = [
            $("#date1"),
            $("#date2"),
            $("#date3"),
            $("#date4"),
            $("#date5"),
          ];

          for (i = 0; i < days.length - 2; i++) {
            var unixDates;
            var actualDates;

            unixDates = days[i].dt;

            actualDates = moment.unix(unixDates).format("M/D/YYYY");

            dates[i].text(actualDates);
          }
        }
        postForecastDates();

        // Displaying temp
        function postForecastTemps() {
          var temps = [
            $("#temp1"),
            $("#temp2"),
            $("#temp3"),
            $("#temp4"),
            $("#temp5"),
          ];

          for (i = 0; i < days.length - 2; i++) {
            postTemps = days[i].temp.day;

            temps[i].text(postTemps + "°F");
          }
        }
        postForecastTemps();

        // Displaying winds
        function postForecastWinds() {
          var winds = [
            $("#wind1"),
            $("#wind2"),
            $("#wind3"),
            $("#wind4"),
            $("#wind5"),
          ];

          for (i = 0; i < days.length - 2; i++) {
            postWinds = days[i].wind_speed;

            winds[i].text(postWinds + " MPH");
          }
        }
        postForecastWinds();

        // Displaying humidity
        function postForecastHumiditys() {
          var humiditys = [
            $("#humidity1"),
            $("#humidity2"),
            $("#humidity3"),
            $("#humidity4"),
            $("#humidity5"),
          ];

          for (i = 0; i < days.length - 2; i++) {
            postHumiditys = days[i].humidity;

            humiditys[i].text(postHumiditys + " %");
          }
        }
        postForecastHumiditys();

        // Displaying Icons
        function postForecastIcons() {
          var icons = [
            $("#pic1"),
            $("#pic2"),
            $("#pic3"),
            $("#pic4"),
            $("#pic5"),
          ];

          for (i = 0; i < days.length - 2; i++) {
            iconID = days[i].weather[0].icon;

            var findIcons = new Image(50, 50);
            findIcons.src =
              "http://openweathermap.org/img/wn/" + iconID + "@2x.png";

            icons[i].html(findIcons);
          }
        }
        postForecastIcons();

        // Updating city name, date and icon
        $("#cityName").html(cityName + " " + dateValue + " ");
        $("#currPic").html(findIconToday);
      });
    })
    // If the enetered city is non existent then shows alert
    .catch(function (error) {
      alert("Not a valid city name. Check input and try again.");
    });

  // Removes a duplicate city from history
  var index = cityHistory.indexOf(cityName);

  if (index > -1) {
    cityHistory.splice(index, 1);
    var selector = "." + cityName;
    $(selector).remove();
  }

  // Adds a city button to history with event listener
  var searchHistory = $("<button>").addClass("col-12").click(btnHistory);

  // Styles buttons
  searchHistory.text(cityName).css({
    height: "30px",
    background: "lightgrey",
    "text-align": "center",
    "border-radius": "5px",
    border: "grey",
    margin: "10px 0px",
    padding: "0px",
  });

  // Appending buttons to ul
  $("ul").append(searchHistory);

  // Adds a class to identify each button by city name
  searchHistory.addClass(cityName);

  // Stores city name in local storage
  localStorage.setItem("cityName", cityName);

  // Gets item from local storage and pushes it to array
  cityHistory.push(localStorage.getItem("cityName"));
}

//----------------------------------------------------------------------------

// Repetion of the getCityData function for each button clicked in history
function btnHistory() {
  // Grabs city name text from each botton element
  cityName = $(this).text();

  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=imperial&appid=" +
    myKey;

  $.ajax({
    url: requestUrl,
    method: "GET",
  }).then(function (response) {
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    var requestUrl1 =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&units=imperial&appid=" +
      myKey;

    $.ajax({
      url: requestUrl1,
      method: "GET",
    }).then(function (response) {
      temp = response.current.temp;
      $("#temperature").text(temp.toFixed(2) + "°F");

      wind = response.current.wind_speed;
      $("#wind").text(wind.toFixed(2) + "MPH");

      humidity = response.current.humidity;
      $("#humidity").text(humidity + " %");

      uvIndex = response.current.uvi;

      if (parseInt(uvIndex) >= 6) {
        $("#uvIndex").text(uvIndex).css({
          "background-color": "red",
          padding: "2.5px 7.5px",
          "border-radius": "3px",
        });
        $("#cityData").css({ border: "solid red 2px", margin: "10px" });
      } else if (parseInt(uvIndex) >= 3 && parseInt(uvIndex) < 6) {
        $("#uvIndex").text(uvIndex).css({
          "background-color": "green",
          padding: "2.5px 7.5px",
          "border-radius": "3px",
        });
        $("#cityData").css({ border: "solid green 2px", margin: "10px" });
      } else {
        $("#uvIndex").text(uvIndex).css({
          "background-color": "yellow",
          padding: "2.5px 7.5px",
          "border-radius": "3px",
        });
        $("#cityData").css({ border: "solid yellow 2px", margin: "10px" });
      }

      iconToday = response.current.weather[0].icon;
      var findIconToday = new Image(50, 50);
      findIconToday.src =
        "http://openweathermap.org/img/wn/" + iconToday + "@2x.png";

      var days = response.daily;
      days.shift();

      function postForecastDates() {
        var dates = [
          $("#date1"),
          $("#date2"),
          $("#date3"),
          $("#date4"),
          $("#date5"),
        ];

        for (i = 0; i < days.length - 2; i++) {
          var unixDates;
          var actualDates;

          unixDates = days[i].dt;

          actualDates = moment.unix(unixDates).format("M/D/YYYY");

          dates[i].text(actualDates);
        }
      }
      postForecastDates();

      function postForecastTemps() {
        var temps = [
          $("#temp1"),
          $("#temp2"),
          $("#temp3"),
          $("#temp4"),
          $("#temp5"),
        ];

        for (i = 0; i < days.length - 2; i++) {
          postTemps = days[i].temp.day;

          temps[i].text(postTemps + "°F");
        }
      }
      postForecastTemps();

      function postForecastWinds() {
        var winds = [
          $("#wind1"),
          $("#wind2"),
          $("#wind3"),
          $("#wind4"),
          $("#wind5"),
        ];

        for (i = 0; i < days.length - 2; i++) {
          postWinds = days[i].wind_speed;

          winds[i].text(postWinds + " MPH");
        }
      }
      postForecastWinds();

      function postForecastHumiditys() {
        var humiditys = [
          $("#humidity1"),
          $("#humidity2"),
          $("#humidity3"),
          $("#humidity4"),
          $("#humidity5"),
        ];

        for (i = 0; i < days.length - 2; i++) {
          postHumiditys = days[i].humidity;

          humiditys[i].text(postHumiditys + " %");
        }
      }
      postForecastHumiditys();

      function postForecastIcons() {
        var icons = [
          $("#pic1"),
          $("#pic2"),
          $("#pic3"),
          $("#pic4"),
          $("#pic5"),
        ];

        for (i = 0; i < days.length - 2; i++) {
          iconID = days[i].weather[0].icon;

          var findIcons = new Image(50, 50);
          findIcons.src =
            "http://openweathermap.org/img/wn/" + iconID + "@2x.png";

          icons[i].html(findIcons);
        }
      }
      postForecastIcons();

      $("#cityName").html(cityName + " " + dateValue + " ");
      $("#currPic").html(findIconToday);
    });
  });
}
