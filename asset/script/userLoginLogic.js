$(document).ready(function(){
    // Gets from local storage the username and first name of the user.
    // Later we will check to see if this is null or not.
    var currentUser = sessionStorage.getItem("user-name");
    var firstName = sessionStorage.getItem("first-name");

    // Checks local storage to see if we have a returning user. 
    // If null then either the user either has not logged in or we have a new user.
    if(currentUser == null)
        $("#user-name-welcome").text("Welcome user ! Are you new here ?");
    else
        $("#user-name-welcome").text("Welcome back " + firstName + ' ! ');

    const firebaseConfig = {
        apiKey: "AIzaSyDORWg5o64fPN4R0Cnt1DlwC_8dWfEhI4U",
        authDomain: "flights-and-fahrenheit.firebaseapp.com",
        databaseURL: "https://flights-and-fahrenheit.firebaseio.com",
        projectId: "flights-and-fahrenheit",
        storageBucket: "flights-and-fahrenheit.appspot.com",
        messagingSenderId: "15407877860",
        appId: "1:15407877860:web:a9fe39f08a0be2871426f1"
      };
    
    // Initialize the firebase DB
    firebase.initializeApp(firebaseConfig);
    
    // References the firebase DB. New users will be saved to the user table.
    var database = firebase.database();
    var users = database.ref("/users");

    function checkPasswordCorrect(){
        var key = $("#user-name").val().trim();

        return users.once('value').then(function(snapshot) {
            var passwordEntered = $("#password").val().trim();
            var usernameEntered = $("#user-name").val().trim();

            // If the user enters a username not in the DB then we need to catch the error in order to process the later logic
            try{var userPassword = snapshot.val()[usernameEntered].password;}
            catch{var userPassword = "..";}

            // Check if the password entered by user is the same as the password in DB
            if(passwordValid(userPassword, passwordEntered)){
                var firstName = snapshot.val()[usernameEntered].firstName;
                sessionStorage.clear();
                sessionStorage.setItem("user-name",usernameEntered);
                sessionStorage.setItem("first-name",firstName);
                console.log(usernameEntered);
                $("#user-name-welcome").text("Welcome back " + firstName + ' ! ');
                window.location.href="mainpage.html";
            }
            else {
                $(".login-validation").text("Please check the username / password entered !");
            }   

        });
    }

    function passwordValid(a,b){
        if(a===b)
            return true;
        else 
            return false;
    };

    $("#user-login").on("click", function(){
        event.preventDefault();
        checkPasswordCorrect();

    });

});