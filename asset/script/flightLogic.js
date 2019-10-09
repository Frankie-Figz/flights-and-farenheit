var currentUser = sessionStorage.getItem("user-name");
var firstName = sessionStorage.getItem("first-name");

console.log(currentUser);

const firebaseConfig = {
    apiKey: "AIzaSyDORWg5o64fPN4R0Cnt1DlwC_8dWfEhI4U",
    authDomain: "flights-and-fahrenheit.firebaseapp.com",
    databaseURL: "https://flights-and-fahrenheit.firebaseio.com",
    projectId: "flights-and-fahrenheit",
    storageBucket: "flights-and-fahrenheit.appspot.com",
    messagingSenderId: "15407877860",
    appId: "1:15407877860:web:a9fe39f08a0be2871426f1"};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var flight = database.ref("/flights");

// var flightAPI = database.ref("/flightsRecord")
// --------------------------------------------------------------
// At the initial load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
function FlightStatusAPI(flightNumber,flightDate){
    event.preventDefault();
    console.log("I am here at flight API");
    console.log(flightDate);
    console.log(flightNumber);

    // + "/" + flightDate

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://aerodatabox.p.rapidapi.com/flights/" + flightNumber,
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "aerodatabox.p.rapidapi.com",
        "x-rapidapi-key": "91517b45bamsh422e95c783d3857p157a15jsne3d2bb772529"
      }
    }

    $.ajax(settings).done(function(response) {
        console.log(settings["url"]);
        console.log(response);
        console.log(response[0].arrival.airport.location.lon);
        console.log(response[0].arrival.airport.location.lat);
        console.log(response[0].arrival.airport.shortName);
        console.log(response[0].arrival.scheduledTimeLocal);

        // console.log(response[0].aircraft.image.url);
        console.log(response[0].aircraft.model);

        var flightDate = $("#date").val().trim();

        // Empties the detail contents of the table.
        $(".detail-flight").empty();

        var flightNumber = response[0].number;
        var aircraftModel = response[0].aircraft.model;
        var arrivalTimeLocal = response[0].arrival.scheduledTimeLocal;

        if(response[0].departure.airport.iata == undefined)
          var departureAirport = response[0].departure.airport.name;
        else
          var departureAirport = response[0].departure.airport.iata;
        
        var arrivalAirport = response[0].arrival.airport.iata;
        var airportStatus = response[0].status;
        var longitud = response[0].arrival.airport.location.lon;
        var latitude = response[0].arrival.airport.location.lat;
        var destination = response[0].arrival.airport.iata;

        console.log(flightNumber);
        console.log("destination",destination);
        console.log("arrivalAirport",arrivalAirport);
        console.log("arrivalTimeLocal",arrivalTimeLocal);
        console.log(aircraftModel);
        console.log(airportStatus);
        console.log(departureAirport);

        displayFlight(flightNumber,departureAirport,arrivalAirport,arrivalTimeLocal,airportStatus,aircraftModel);

        console.log("I am here waiting to write !");
        writeNewFlightSchedule(flightNumber,destination,flightDate,currentUser,latitude,longitud,departureAirport,arrivalAirport,airportStatus,aircraftModel,arrivalTimeLocal);

    }).fail(function(error){
      console.log("I am here at the error validation !");
      console.log(error);
    });
}

// Whenever a user clicks the submit-bid button
$("#submit-flight").on("click", function(event) {
  // Prevent form from submitting
  // event.preventDefault();

  var flightNumber = $("#flight-number").val().trim();
  var destination = $("#destination").val().trim();
  var flightDate = $("#date").val().trim();
  
  if((currentUser !== null)){
    FlightStatusAPI(flightNumber,flightDate);
  }
  
});

// Write a scheduling to the train table
function writeNewFlightSchedule(flightNumberInput,destinationInput,flightDateInput,userID,latInput,lonInput,DAInput, AAInput, SInput, AMInput,LTInput) {

  // Form the object that will be saved to DB
  // Params : Flight Number, Departure Airport, Arrival Airport, Arrival Time, Status Input, Aircraft Model are needed for redraw.
  var scheduleData = {
    flightNumber: flightNumberInput,
    departureAirport: DAInput,
    arrivalAirport: AAInput,
    arrivalTime: LTInput,
    status: SInput,
    destination: destinationInput,
    flightDate: flightDateInput,
    latitude: latInput,
    longitud: lonInput,
    aircraftModel: AMInput};

  // Get a key uniquely identify the object that will be saved to DB
  flight.child(userID).set(scheduleData);

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