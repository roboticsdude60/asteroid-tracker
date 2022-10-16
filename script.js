const canvas = document.getElementById("myCanvas");
canvas.width = visualViewport.width;
canvas.height = 300;
const centerCrossAxis = canvas.height / 2;

function drawEarth() {
  const ctx = canvas.getContext("2d");
  // draw earth
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(-1120, centerCrossAxis, 1200, 0, 2 * Math.PI);
  ctx.fill();
  // label earth
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("Earth", 15, centerCrossAxis);
}

// give me the lunar miss distance
// and the average of the estimated_diameter_min and estimated_diameter_max in kilometers
function drawAsteroid(asteroid) {
  // I don't want to worry about overlapping asteroids,
  // but still, let's spread them out a bit with a random offset -- Sick
  const crossAxisLocation = 20 + Math.floor(Math.random() * 260);
  const ctx = canvas.getContext("2d");
  const r = Math.max(
    (asteroid.estimated_diameter_min + asteroid.estimated_diameter_max) * 8,
    1
  );
  const distanceMainAxis = 100 + asteroid.miss_distance * 3.4;
  if (asteroid.is_potentially_hazardous_asteroid) {
    ctx.fillStyle = "orange";
  } else {
    ctx.fillStyle = "black";
  }
  ctx.beginPath();

  ctx.arc(distanceMainAxis, crossAxisLocation, r, 0, 2 * Math.PI);
  ctx.fill();
  ctx.font = "8px Arial";
  ctx.fillText(asteroid.name, distanceMainAxis + r + 10, crossAxisLocation - r);
}

/*
API format:
https://api.nasa.gov/neo/rest/v1/feed?start_date=START_DATE&end_date=END_DATE&api_key=API_KEY
START_DATE: YYYY-MM-DD
END_DATE: YYYY-MM-DD
API_KEY: JomaPZShT3jY2Bww2JRw79EuofjA8TW3CldDLJdl
*/

function getAsteroidAPIURL() {
  const start_date = document.getElementById("date").value;
  const end_date = start_date;

  const regex =
    /^\d{4}-(((0[1-9])|(1[0-2])))-((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1]))$/;
  if (regex.test(start_date) == false || regex.test(end_date) == false) {
    console.log("START_DATE or END_DATE is not formatted in YYYY-MM-DD format");
    start_date = "2000-05-05";
    end_date = "2000-05-06";
  }
  return makeURL(start_date, end_date);
}

function makeURL(start_date, end_date) {
  const apiKey = "JomaPZShT3jY2Bww2JRw79EuofjA8TW3CldDLJdl";
  return `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&end_date=${end_date}&api_key=${apiKey}`;
}

function clear() {
  const c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
}

async function getAsteroidData(event) {
  // otherwise submitting the form makes the whole page refresh
  event.preventDefault();

  const url = getAsteroidAPIURL();
  console.log(url);
  fetch(url)
    .then(function (response) {
      if (response.status != 200) {
        console.log("Error when fetching: " + response.statusText);
        throw response;
      } else {
        return response.json();
      }
    })
    .then(function (json) {
      const asteroids = organizeAsteroidData(json);
      drawEarth();

      asteroids.forEach((asteroid) => {
        drawAsteroid(asteroid);
      });
    });
}

/*
Will organize all the data from the json to:

{
name: string
estimated_diameter_min: float(km)
estimated_diameter_max: float(km)
is_potentially_hazardous_asteroid: boolean
miss_distance: float (lunar)
relative_velocity: float(km/sec)
//what else do we want?
}
*/

function organizeAsteroidData(json_data) {
  console.log(`organizing asteroid data`);
  let near_earth_objects = [];
  const keys = Object.keys(json_data.near_earth_objects);
  keys.forEach((key) => {
    near_earth_objects = [
      ...near_earth_objects,
      ...json_data.near_earth_objects[key],
    ];
  });

  const asteroids = near_earth_objects.map((object) => ({
    name: object.name,
    estimated_diameter_min:
      object.estimated_diameter.kilometers.estimated_diameter_min,
    estimated_diameter_max:
      object.estimated_diameter.kilometers.estimated_diameter_max,
    is_potentially_hazardous_asteroid: object.is_potentially_hazardous_asteroid,
    miss_distance: object.close_approach_data[0].miss_distance.lunar,
    relative_velocity:
      object.close_approach_data[0].relative_velocity.kilometers_per_second,
  }));
  console.log(asteroids);
  return asteroids;
}

// getAsteroidsThisWeek();

document.getElementById("submit").addEventListener("click", getAsteroidData);
document.getElementById("clear").addEventListener("click", clear);
