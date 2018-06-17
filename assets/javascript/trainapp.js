$(document).ready(function () {
var config = {
    apiKey: "AIzaSyCNlTa0v1Md8zSacXTg81HUpkB0VsCKJ7Q",
    authDomain: "trainscheduler-5823f.firebaseapp.com",
    databaseURL: "https://trainscheduler-5823f.firebaseio.com",
    projectId: "trainscheduler-5823f",
    storageBucket: "trainscheduler-5823f.appspot.com",
    messagingSenderId: "717993670976"
  };
  firebase.initializeApp(config);

  var trainData = firebase.database();

  var name = "";
  var destination = "";
  var first = "";
  var frequency = "";

  $(document).on("click", "#submit", function (event) {
      event.preventDefault();
      var name = $("#train-name-input").val().trim();
      var destination = $("#destination-input").val().trim();
      var first = $("#first-input").val().trim();
      var frequency = $("#frequency-input").val().trim();
    
      trainData.ref().push({
        name: name,
        destination: destination,
        first: first,
        frequency: frequency
      });
    $("#myForm").each(function () {
        this.reset();
    });
  });

//train calculations
  trainData.ref().on("child_added", function(childSnapshot) {
    var firstConverted = moment(childSnapshot.val().first, "HH:mm").subtract(1, "years");
    console.log(firstConverted);
    var currentTime = moment();
    console.log ("Current Time: " + moment(currentTime).format("hh:mm"));
    var diffTime = moment().diff(moment(firstConverted), "minutes");
    console.log ("Difference in time: " + diffTime);
  
    var tRemainder = diffTime % childSnapshot.val().frequency;
    console.log("Remainder: " +tRemainder);
  
    var timeTill = childSnapshot.val().frequency - tRemainder;
    console.log("Minutes till train: " + timeTill);
  
    var nextTrain = moment().add(timeTill, "minutes");
    console.log("Arrival Time: " + moment (nextTrain).format("hh:mm"));

      console.log(childSnapshot.val().name);
      console.log(childSnapshot.val().destination);
      console.log(childSnapshot.val().first);
      console.log(childSnapshot.val().frequency);
      $("tbody").append("<tr></tr>");
      $("tbody").append("<td>" + childSnapshot.val().name + "</td>");
      $("tbody").append("<td>" + childSnapshot.val().destination + "</td>");
      $("tbody").append("<td>" + childSnapshot.val().frequency + "</td>");
      $("tbody").append("<td>" + moment (nextTrain).format("HH:mm") + "</td>");
      $("tbody").append("<td>" + timeTill + "</td>");
  })

})