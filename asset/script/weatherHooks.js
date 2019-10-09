var currentUser = sessionStorage.getItem("user-name");
var firstName = sessionStorage.getItem("first-name");

$(document).ready(function () {

    // var firebaseConfig = {
    //     apiKey: "AIzaSyDORWg5o64fPN4R0Cnt1DlwC_8dWfEhI4U",
    //     authDomain: "flights-and-fahrenheit.firebaseapp.com",
    //     databaseURL: "https://flights-and-fahrenheit.firebaseio.com",
    //     projectId: "flights-and-fahrenheit",
    //     storageBucket: "flights-and-fahrenheit.appspot.com",
    //     messagingSenderId: "15407877860",
    //     appId: "1:15407877860:web:a9fe39f08a0be2871426f1"
    // };
    // firebase.initializeApp(firebaseConfig);
    
    var database = firebase.database();
    var weather = database.ref("/weather");

    if(currentUser !== null){
        var flightsUser = database.ref("/flights/" + currentUser);
        
        database.ref("/flights/" + currentUser).on("value", function(snapshot) {
            console.log("I am here on value change !");
            console.log(snapshot.val());
            console.log(snapshot.val().latitude);
            console.log(snapshot.val().longitud);
            console.log(snapshot.val().flightDate);
            weatherAndTime(snapshot.val().longitud,snapshot.val().latitude,snapshot.val().flightDate);

            // Params : Flight Number, Departure Airport, Arrival Airport, Arrival Time, Status Input, Aircraft Model.
            displayFlight(snapshot.val().flightDate, snapshot.val().departureAirport, snapshot.val().arrivalAirport ,snapshot.val().flightDate, snapshot.val().status, snapshot.val().status);

        }, function(errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
        
    }

    function weatherAndTime(lon,lat,dateInput) {
        var weatherSettings = {
            "async": true,
            "crossDomain": true,
            "url": "https://weather2020-weather-v1.p.rapidapi.com/e8ecee8ff60c478f8a36280fea0524fe/" + lat + "," + lon,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "weather2020-weather-v1.p.rapidapi.com",
                "x-rapidapi-key": "91517b45bamsh422e95c783d3857p157a15jsne3d2bb772529"
            }
        }

        $.ajax(weatherSettings).done(function (resp) {

            var userDate = dateInput;
            userCompSeconds = convertUserDate(userDate);

            console.log(resp);
            localWeather = resp;
            weather.push(localWeather);

            for (i = 0; i < 11; i++) {
                var firstWeek = localWeather[i].startDate;
                var secondWeek = localWeather[i + 1].startDate;
                // console.log("I am first week: " + firstWeek);
                // console.log("I am second week: "+ secondWeek);
                // console.log("Usercompseconds: "+ userCompSeconds);
                if ((firstWeek < userCompSeconds) && (userCompSeconds < secondWeek)) {
                   console.log(localWeather[i].regionAffected);
                    console.log(localWeather[i].headline);
                    console.log(localWeather[i].conditions[0].display);
                    console.log(localWeather[i].forecastDesc);
                    console.log(localWeather[i].temperatureHigh + "F");
                    console.log(localWeather[i].temperatureLow + "F");
                    
                    
                    $("#region").text("Region: "+(localWeather[i].regionAffected));
                    $("#headline").text("Headline: " +localWeather[i].headline);
                    //(localWeather[i].conditions[0].display);
                    $("#forecast").text("Forecast: "+(localWeather[i].forecastDesc));
                    $("#high-temp").text("High Temperature: "+ (localWeather[i].temperatureHigh + "F"));
                    $("#low-temp").text("Low Temperature: "+ (localWeather[i].temperatureLow + "F"));
                }
            }
        });

    }
    

    function convertUserDate(u) {
        var dateString = u;
        var momentObj = moment(dateString, 'YYYY-MM-DD');
        userCompSeconds = momentObj.valueOf();
        userCompSeconds = userCompSeconds / 1000;
        return userCompSeconds;
    }

    // Params : Flight Number, Departure Airport, Arrival Airport, Arrival Time, Status Input, Aircraft Model.
    function displayFlight(FNInput,DAInput,AAInput,ATInput,SInput,AMInput){
    
        var row = $("<tr>");
        row.addClass("detail-flight");
    
        var thFN = $("<td>");
        var thDeptAir = $("<td>");
        var thArrAir = $("<td>");
        var thTimeLocal = $("<td>");
        var thStatus = $("<td>");
        var thAircraftModel = $("<td>");
    
        thFN.text(FNInput);
        thDeptAir.text(DAInput);
        thArrAir.text(AAInput);
        thTimeLocal.text(ATInput);
        thStatus.text(SInput);
        thAircraftModel.text(AMInput);
    
        row.append(thFN);
        row.append(thDeptAir);
        row.append(thArrAir);
        row.append(thTimeLocal);
        row.append(thStatus);
        row.append(thAircraftModel);
    
        $(".flight").append(row);
    }
    
});