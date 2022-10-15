const canvas = document.getElementById("myCanvas");
canvas.width  = visualViewport.width;
canvas.height = 300;
const ctx = canvas.getContext("2d");

// draw earth
const ma = canvas.height / 2;
ctx.beginPath();
ctx.arc(-60, canvas.height / 2, 200, 0, 2 * Math.PI);
ctx.fill();
// label earth
ctx.fillStyle = "white";
ctx.font = "18px Arial";
ctx.fillText("Earth", 10, 50);



/*
This is your site JavaScript code - you can add interactivity and carry out processing
- Initially the JS writes a message to the console, and moves a button you can add from the README
*/

// Print a message in the browser's dev tools console each time the page loads
// Use your menus or right-click / control-click and choose "Inspect" > "Console"
console.log("Hello 🌎");

/* 
Make the "Click me!" button move when the visitor clicks it:
- First add the button to the page by following the "Next steps" in the README
*/
const btn = document.querySelector("button"); // Get the button from the page
// Detect clicks on the button
if (btn) {
  btn.onclick = function() {
    // The JS works in conjunction with the 'dipped' code in style.css
    btn.classList.toggle("dipped");
  };
}

/*
API format:
https://api.nasa.gov/neo/rest/v1/feed?start_date=START_DATE&end_date=END_DATE&api_key=API_KEY
START_DATE: YYYY-MM-DD
END_DATE: YYYY-MM-DD
API_KEY: N/A
*/

function asteroidAPIURL(start_date, end_date) {
  const regex = /\d{4}-\d{2}-\d{2}/
  if (regex.test(start_date) == false || regex.test(end_date) == false){
    throw 'START_DATE or END_DATE is not formatted in YYYY-MM-DD format'
  }
  const asteroidAPIURL = "https://api.nasa.gov/neo/rest/v1/feed?" + start_date 
  
  }


function getAsteroidData(start_date, end_date) {
  fetch(asteroidAPIURL)
    .then(function(response) {
          if (response.satatus != 200) {
            return {
              text: "Error calling asteroid API: " + response.statusText
            }
          }
          return response.json();
      }).then (function(json) {
    organizeAsteroidData(json);
  })
}

function organizeAsteroidData(json_data){
  
}

// This is a single line JS comment
/*
This is a comment that can span multiple lines 
- use comments to make your own notes!
*/




