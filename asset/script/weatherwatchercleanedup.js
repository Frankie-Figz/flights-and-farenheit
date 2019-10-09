$(document).ready(function () {
    var firebaseConfig = {
        apiKey: "AIzaSyDORWg5o64fPN4R0Cnt1DlwC_8dWfEhI4U",
        authDomain: "flights-and-fahrenheit.firebaseapp.com",
        databaseURL: "https://flights-and-fahrenheit.firebaseio.com",
        projectId: "flights-and-fahrenheit",
        storageBucket: "flights-and-fahrenheit.appspot.com",
        messagingSenderId: "15407877860",
        appId: "1:15407877860:web:a9fe39f08a0be2871426f1"
    };
    //firebase.initializeApp(firebaseConfig);
    var flightArrivalLon = 0;
    var flightArrivalLat = 0;
    var userDate = "";
    var localWeather = "";

    $("#submit-flight").on("click", function () {

        event.preventDefault();
        var query = $("#flight-number").val().trim();
        var airSettings = {
            "async": false,
            "crossDomain": true,
            "url": "https://aerodatabox.p.rapidapi.com/flights/" + query,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "aerodatabox.p.rapidapi.com",
                "x-rapidapi-key": "91517b45bamsh422e95c783d3857p157a15jsne3d2bb772529"
            }
        }
        $.ajax(airSettings).done(function (response) {
            var arrival = response;
            flightArrivalLat = arrival[0].arrival.airport.location.lat;
            flightArrivalLon = arrival[0].arrival.airport.location.lon;
        });
        console.log("The folowing is arrival Lattitude");
        console.log(flightArrivalLat);
        console.log("The folowing is arrival Longtitude");
        console.log(flightArrivalLon);
        weatherAndTime();
        //Call AJAX for weather and spit out relevant results
        function weatherAndTime() {
            convertUserDate();
            var weatherSettings = {
                "async": true,
                "crossDomain": true,
                "url": "https://weather2020-weather-v1.p.rapidapi.com/e8ecee8ff60c478f8a36280fea0524fe/" + flightArrivalLat + "," + flightArrivalLon,
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "weather2020-weather-v1.p.rapidapi.com",
                    "x-rapidapi-key": "91517b45bamsh422e95c783d3857p157a15jsne3d2bb772529"
                }
            }
            $.ajax(weatherSettings).done(function (resp) {
                console.log(resp);
                localWeather = resp;
                for (i = 0; i < 11; i++) {
                    var firstWeek = localWeather[i].startDate;
                    var secondWeek = localWeather[i + 1].startDate;
                    // console.log("I am first week: " + firstWeek);
                    // console.log("I am second week: "+ secondWeek);
                    // console.log("Usercompseconds: "+ userCompSeconds);
                    if ((firstWeek < userCompSeconds) && (userCompSeconds < secondWeek)) {
                       console.log(localWeather[i].regionAffected);
                        console.log("Headline: "+localWeather[i].headline);
                        console.log("Conditinon: "+localWeather[i].conditions[0].display);
                        console.log("Forecast Description: "+localWeather[i].forecastDesc);
                        console.log("High Temp: "+localWeather[i].temperatureHigh + "F");
                        console.log("Low Temp: "+localWeather[i].temperatureLow + "F");
                        
                        $("#region").empty();
                        $("#headline").empty();
                        $("#forecast").empty();
                        $("#high-temp").empty();
                        $("#low-temp").empty();
                        
                        
                        $("#region").append("<span class='weather-text'>Region: </span>"+(localWeather[i].regionAffected));
                        $("#headline").append("<span class='weather-text'>Headline: </span>"+(localWeather[i].headline));
                        //console.log("condition is : "+ (localWeather[i].conditions[0].display));
                        $("#forecast").append("<span class='weather-text'>Forecast: </span>"+(localWeather[i].forecastDesc));
                        $("#high-temp").append("<span class='weather-text'>High Temp: </span>"+(localWeather[i].temperatureHigh + "F"));
                        $("#low-temp").append("<span class='weather-text'>Low Temp: </span>"+(localWeather[i].temperatureLow + "F"));
                            $("#image-weather").empty();
                            $("#clothing-item1").empty();
                            $("#clothing-item2").empty();
                            $("#clothing-item3").empty();
                        var condition = localWeather[i].conditions[0].display;
                        if((condition)=="Overcast"){
                            $("#image-weather").append("<img class='weather-image w-100' align:'middle' src='images/sun-and-cloud.png'/> ");
                            $("#clothing-item1").append("<img class='weather-image w-100' align:'middle' src='images/Archive/clear-weather-outfit/sunnyoutfitmale03.jpg'/> ");
                            $("#clothing-item2").append("<img class='weather-image w-100' align:'middle' src='images/Archive/clear-weather-outfit/femaleoutfit02.jpg'/> ");
                            $("#clothing-item3").append("<img class='weather-image w-100' align:'middle' src='images/Archive/clear-weather-outfit/sunnyoutfit05.jpg'/> ");
                        } else if (condition == "Snow"){
                            $("#image-weather").append("<img class='weather-image w-100' align:'middle' src='images/snowflake.png'/> ");
                            $("#clothing-item1").append("<img class='weather-image w-100' align:'middle' src='images/Archive/cold-weather-outfit/snowoutfit/femalesnowoutfit03.jpg'/> ");
                            $("#clothing-item2").append("<img class='weather-image w-100' align:'middle' src='images/Archive/cold-weather-outfit/snowoutfit/malesnowoutfit01.jpg'/> ");
                            $("#clothing-item3").append("<img class='weather-image w-100' align:'middle' src='images/Archive/cold-weather-outfit/snowoutfit/couplesnowoutfit.jpg'/> ");
                        } else if (condition == "Thunderstorm"){
                            $("#image-weather").append("<img class='weather-image w-100' align:'middle' src='images/thunder-cloud.png'/> ");
                            $("#clothing-item1").append("<img class='weather-image w-100' align:'middle' src='images/Archive/rainy-weather-outfit/male/twister_tornado.jpg'/> ");
                            $("#clothing-item2").append("<img class='weather-image w-100' align:'middle' src='images/Archive/rainy-weather-outfit/female/IMG_1189.jpg'/> ");
                            $("#clothing-item3").append("<img class='weather-image w-100' align:'middle' src='images/Archive/rainy-weather-outfit/couple/IMG_1172.jpg'/> ");
                        } else if (condition == "Rain" || condition =="Rainy") {
                            $("#image-weather").append("<img class='weather-image w-100' align:'middle' src='images/rain-cloud.png'/> ");
                            $("#clothing-item1").append("<img class='weather-image w-100' align:'middle' src='images/Archive/rainy-weather-outfit/male/IMG_1176.jpg'/> ");
                            $("#clothing-item2").append("<img class='weather-image w-100' align:'middle' src='images/Archive/rainy-weather-outfit/female/IMG_1185.jpg'/> ");
                            $("#clothing-item3").append("<img class='weather-image w-100' align:'middle' src='images/Archive/rainy-weather-outfit/couple/IMG_1172.jpg'/> ");
                        } else if (condition == "Mostly Cloudy" || condition == "Cloudy"){
                            $("#image-weather").append("<img class='weather-image w-100' align:'middle' src='images/cloudy.png'/> ");
                            $("#clothing-item1").append("<img class='weather-image w-100' align:'middle' src='images/Archive/cold-weather-outfit/malewinteroutfit01.jpg'/> ");
                            $("#clothing-item2").append("<img class='weather-image w-100' align:'middle' src='images/Archive/cold-weather-outfit/femalewinter01.jpg'/> ");
                            $("#clothing-item3").append("<img class='weather-image w-100' align:'middle' src='images/Archive/cold-weather-outfit/wintercouple.jpg'/> ");
                        }else{
                            $("#image-weather").append("<img class='weather-image w-100' align:'middle' src='images/sun.png'/> ");
                            $("#clothing-item1").append("<img class='weather-image w-100' align:'middle' src='images/Archive/clear-weather-outfit/femaleoutfit01.jpg'/> ");
                            $("#clothing-item2").append("<img class='weather-image w-100' align:'middle' src='images/Archive/clear-weather-outfit/sunnyoutfitmale02.jpg'/> ");
                            $("#clothing-item3").append("<img class='weather-image w-100' align:'middle' src='images/Archive/clear-weather-outfit/sunnyoutfitmale03.jpg'/> ");
                        }
                    }
                }
            });
        }
        function convertUserDate() {
            
            userDate = $("#date").val().trim();
            console.log("This is userDate: "+ userDate);
            var dateString = userDate;
            var momentObj = moment(dateString, 'YYYY-MM-DD');
            userCompSeconds = momentObj.valueOf();
            userCompSeconds = userCompSeconds / 1000;
        }
    });
});