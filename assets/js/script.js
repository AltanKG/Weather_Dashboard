var date = $("#date");
var dateValue = moment().format("(M/D/YYYY)");
var cityHistory = [];

date.text(dateValue);

var myKey = "06e368149eaec718bf08b835480c028b";

$("#search").on("click", getCityData);

function getCityData() {
  var cityName = $("#userInput").val();

  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=imperial&appid=" +
    myKey;

  $.ajax({
    url: requestUrl,
    method: "GET",
  })
    .then(function (response) {
      console.log("AJAX Response \n-------------");
      console.log(response);

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
        console.log("AJAX Response \n-------------");
        console.log(response);

        temp = response.current.temp;
        $("#temperature").text(temp.toFixed(2) + "°F");

        wind = response.current.wind_speed;
        $("#wind").text(wind.toFixed(2) + "MPH");

        humidity = response.current.humidity;
        $("#humidity").text(humidity + " %");

        uvIndex = response.daily[0].uvi;
        $("#uvIndex").text(uvIndex).css({
          "background-color": "red",
          padding: "2.5px 7.5px",
          "border-radius": "3px",
        });

        // isSaved = true;
        // if (isSaved) {
        //   localStorage.setItem("temperature", temp);
        //   localStorage.setItem("wind", wind);
        //   localStorage.setItem("humidity", humidity);
        //   localStorage.setItem("uvIndex", uvIndex);

        iconToday = response.current.weather[0].icon;
        var findIconToday = new Image(50, 50);
        findIconToday.src =
          "http://openweathermap.org/img/wn/" + iconToday + "@2x.png";

        var days = response.daily;
        days.shift();
        console.log(days);

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
    })
    .catch(function (error) {
      alert("Not a valid city name. Check input and try again.");
    });

  var index = cityHistory.indexOf(cityName);
  console.log(index);
  if (index > -1) {
    cityHistory.splice(index, 1);
    var selector = "." + cityName;
    $(selector).remove();

    console.log(cityHistory);
  }

  var searchHistory = $("<button>").addClass("col-12").click(btnHistory);

  searchHistory.text(cityName).css({
    height: "30px",
    background: "lightgrey",
    "text-align": "center",
    "border-radius": "5px",
    border: "grey",
    margin: "10px 0px",
    padding: "0px",
  });
  $("ul").append(searchHistory);

  console.log(cityName);
  searchHistory.addClass(cityName);

  // $("#search").on("click", cityName, function () {
  //   $(cityName).remove();
  // });

  localStorage.setItem("cityName", cityName);

  cityHistory.push(localStorage.getItem("cityName"));
  isSearched = false;
}

//-------------------------------------------------------------

function btnHistory() {
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
    console.log("AJAX Response \n-------------");
    console.log(response);

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
      console.log("AJAX Response \n-------------");
      console.log(response);

      temp = response.current.temp;
      $("#temperature").text(temp.toFixed(2) + "°F");

      wind = response.current.wind_speed;
      $("#wind").text(wind.toFixed(2) + "MPH");

      humidity = response.current.humidity;
      $("#humidity").text(humidity + " %");

      uvIndex = response.daily[0].uvi;
      $("#uvIndex").text(uvIndex).css({
        "background-color": "red",
        padding: "2.5px 7.5px",
        "border-radius": "3px",
      });

      iconToday = response.current.weather[0].icon;
      var findIconToday = new Image(50, 50);
      findIconToday.src =
        "http://openweathermap.org/img/wn/" + iconToday + "@2x.png";

      var days = response.daily;
      days.shift();
      console.log(days);

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
