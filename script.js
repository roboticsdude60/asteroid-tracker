const canvas = document.getElementById("myCanvas");
canvas.width = visualViewport.width;
canvas.height = 300;
const centerCrossAxis = canvas.height / 2;

function drawEarth() {
  const ctx = canvas.getContext("2d");
  // draw earth
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(-80, centerCrossAxis, 200, 0, 2 * Math.PI);
  ctx.fill();
  // label earth
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("Earth", 20, centerCrossAxis);
}

// give me the lunar miss distance
// and the average of the estimated_diameter_min and estimated_diameter_max in kilometers
function drawAsteroid(name, distance, diameter) {
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(distance * 3, centerCrossAxis, diameter * 10, 0, 2 * Math.PI);
  ctx.fill();
}

drawEarth();
drawAsteroid("465633 (2009 JR5)", 117.7689258646, 0.2251930467);

/* 
Make the "Click me!" button move when the visitor clicks it:
- First add the button to the page by following the "Next steps" in the README
*/
const btn = document.querySelector("button"); // Get the button from the page
// Detect clicks on the button
if (btn) {
  btn.onclick = function () {
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

const asteroidAPIURL = "";
function setAsteroidAPIURL() {
  const start_date = document.getElementById("start_date").innerHTML;
  const end_date = document.getElementById("end_date").innerHTML;
  const regex = /^\d{4}-(((0[1-9])|(1[0-2])))-((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1]))$/;
  if (regex.test(start_date) == false || regex.test(end_date) == false) {
    throw "START_DATE or END_DATE is not formatted in YYYY-MM-DD format";
  }
  asteroidAPIURL =
    "https://api.nasa.gov/neo/rest/v1/feed?start_date=" +
    start_date +
    "&end_date=" +
    end_date;
}

function getAsteroidData() {
  try {
    setAsteroidAPIURL();

    fetch(asteroidAPIURL)
      .then(function (response) {
        if (response.satatus != 200) {
          return {
            text: "Error calling asteroid API: " + response.statusText,
          };
        }
        return response.json();
      })
      .then(function (json) {
        organizeAsteroidData(json);
      });
  } catch (err) {
    console.log(err);
  }
}

/*
Will organize all the data from the json to:

{
name: string
estimated_diameter_min: float(km)
estimated_diameter_max: float(km)
is_potentially_hazardous_asteroid: boolean
miss_distance: float (km)
relative_velocity: float(km/sec)
//what else do we want?
}
*/
function organizeAsteroidData(json_data) {
  console.log(`organizing asteroid data: ${JSON.stringify(json_data)}`);
  const asteroids = [];
  const near_earth_objects = json_data.near_earth_objects;
  near_earth_objects.forEach((object) => {
    const asteroid = {};
    asteroid.name = object.name;
    asteroid.estimated_diameter_min =
      object.estimated_diameter.kilometers.estimated_diameter_min;
    asteroid.estimated_diameter_max =
      object.estimated_diameter.kilometers.estimated_diameter_max;
    asteroid.is_potentially_hazardous_asteroid =
      object.is_potentially_hazardous_asteroid;
    asteroid.miss_distance =
      object.close_approach_data.miss_distance.kilometers;
    asteroid.relative_velocity =
      object.close_approach_data.relative_velocity.kilometers_per_second;
    asteroids.push(asteroid);
  });
  console.log(json_data);
}

document
  .getElementById("submit")
  .addEventListener("click", getAsteroidData);
