// =======================================================
// ORBITALGUARD AI
// Mission Controller
// app.js (Part 1)
// =======================================================

// =======================================================
// GLOBAL VARIABLES
// =======================================================

let missionStarted = false;

let refreshRate = 5000;

let timelineLimit = 15;

const aiMessages = [

  "Initializing Mission Control...",

  "Scanning orbital environment...",

  "Tracking active satellites...",

  "Computing collision probabilities...",

  "Evaluating debris capture priorities...",

  "Synchronizing Earth visualization...",

  "Updating orbital database...",

  "AI Mission Control Active"

];

let aiMessageIndex = 0;

// =======================================================
// WEST AFRICA TIME (WAT)
// =======================================================

function updateClock() {

  const clock =
  document.getElementById("utcClock");

  if (!clock) return;

  const now = new Date();

  const options = {

    timeZone: "Africa/Lagos",

    hour: "2-digit",

    minute: "2-digit",

    second: "2-digit",

    hour12: false

  };

  clock.innerHTML =
  now.toLocaleTimeString(
    "en-NG",
    options
  )+" WAT";

}

updateClock();

setInterval(updateClock, 1000);

// =======================================================
// TIMELINE ENGINE
// =======================================================

function addTimeline(message) {

  const timeline =
  document.getElementById("timeline");

  if (!timeline) return;

  const now = new Date();

  const time = now.toLocaleTimeString(

    "en-NG",

    {

      timeZone: "Africa/Lagos",

      hour: "2-digit",

      minute: "2-digit",

      second: "2-digit",

      hour12: false

    }

  );

  const item =
  document.createElement("div");

  item.className = "timelineItem";

  item.innerHTML = `

  <span class="time">

  ${time}

  </span>

  ${message}

  `;

  timeline.prepend(item);

  while (

    timeline.children.length >

    timelineLimit

  ) {

    timeline.removeChild(

      timeline.lastChild

    );

  }

}

// =======================================================
// AI STATUS ENGINE
// =======================================================

function rotateMissionStatus() {

  const status =
  document.getElementById("status");

  if (!status) return;

  status.innerHTML =
  aiMessages[
    aiMessageIndex
  ];

  addTimeline(

    aiMessages[
      aiMessageIndex
    ]

  );

  aiMessageIndex++;

  if (

    aiMessageIndex >=

    aiMessages.length

  ) {

    aiMessageIndex = 0;

  }

}

setInterval(

  rotateMissionStatus,

  10000

);

// =======================================================
// MISSION STARTUP
// =======================================================

function startupSequence() {

  if (missionStarted)

    return;

  missionStarted = true;

  addTimeline(

    "Powering Mission Control"

  );

  setTimeout(()=> {

    addTimeline(

      "Earth Engine Online"

    );

  }, 1000);

  setTimeout(()=> {

    addTimeline(

      "Satellite Tracker Online"

    );

  }, 2000);

  setTimeout(()=> {

    addTimeline(

      "AI Analysis Engine Online"

    );

  }, 3000);

  setTimeout(()=> {

    addTimeline(

      "Collision Detection Ready"

    );

  }, 4000);

  setTimeout(()=> {

    document.getElementById(

      "status"

    ).innerHTML =

    "Mission Control Active";

    addTimeline(

      "Mission Control Ready"

    );

  }, 5000);

}

// =======================================================
// WARNING ENGINE
// =======================================================

function updateWarningPanel() {

  const panel =
  document.getElementById(

    "warningBox"

  );

  if (!panel)

    return;

  const collisionText =

  document.getElementById(

    "collisions"

  )?.innerText || "0";

  const collisionCount =

  parseInt(collisionText);

  if (collisionCount >= 50) {

    panel.innerHTML =

    "🔴 HIGH COLLISION RISK";

    panel.style.color = "#ff5555";

  } else if (collisionCount >= 20) {

    panel.innerHTML =

    "🟠 MODERATE COLLISION RISK";

    panel.style.color = "#ffaa00";

  } else {

    panel.innerHTML =

    "🟢 ORBITAL TRAFFIC STABLE";

    panel.style.color = "#00ff99";

  }

}

setInterval(

  updateWarningPanel,

  5000

);

// =======================================================
// SYSTEM HEALTH
// =======================================================

function systemHealth() {

  const status =
  document.getElementById("status");

  if (!status) return;

  status.style.color = "#00d8ff";

}

systemHealth(); // =======================================================
// ORBITALGUARD AI
// app.js (Part 2)
// Mission Control Coordinator
// =======================================================

// =======================================================
// DASHBOARD REFRESH
// =======================================================

function refreshMissionControl() {

  if (typeof updateDashboard === "function") {

    updateDashboard();

  }

  updateWarningPanel();

}

// =======================================================
// EARTH SYNCHRONIZATION
// =======================================================

function syncEarth() {

  if (
    typeof buildSatelliteMeshes === "function" &&
    typeof satellites !== "undefined"
  ) {

    buildSatelliteMeshes(satellites);

  }

}

// =======================================================
// SATELLITE REFRESH
// =======================================================

function refreshSatellites() {

  if (typeof moveObjects === "function") {

    moveObjects();

  }

  refreshMissionControl();

}

setInterval(

  refreshSatellites,

  refreshRate

);

// =======================================================
// SATELLITE INFORMATION PANEL
// =======================================================

function showSatelliteInfo(obj) {

  if (!obj) return;

  const panel =
  document.getElementById("objectInfo");

  if (!panel) return;

  const mass =
  obj.mass ??
  Math.floor(Math.random()*8000+200);

  const risk =
  obj.risk ??
  Math.floor(Math.random()*100);

  const priority =
  risk > 70
  ? "HIGH": risk > 40
  ? "MEDIUM": "LOW";

  const recommendation =

  priority === "HIGH"

  ? "Recommended for AI robotic capture.":

  priority === "MEDIUM"

  ? "Continue monitoring.":

  "No immediate action required.";

  panel.innerHTML = `

  <h3>${obj.name}</h3>

  <hr>

  <p><strong>NORAD ID:</strong> ${obj.id || "Unknown"}</p>

  <p><strong>Orbit:</strong> ${obj.orbit}</p>

  <p><strong>Altitude:</strong> ${obj.altitude} km</p>

  <p><strong>Velocity:</strong> ${obj.speed} km/s</p>

  <p><strong>Estimated Mass:</strong> ${mass} kg</p>

  <p><strong>Collision Risk:</strong> ${risk}%</p>

  <p><strong>AI Priority:</strong> ${priority}</p>

  <p><strong>Status:</strong> ACTIVE</p>

  <p><strong>Recommendation:</strong></p>

  <p>${recommendation}</p>

  <p>

  <strong>Updated:</strong>

  ${new Date().toLocaleString(

    "en-NG",

    {

      timeZone: "Africa/Lagos"

    }

  )} WAT

  </p>

  `;

}

// =======================================================
// SEARCH
// =======================================================

function searchObject() {

  const input =
  document.getElementById("searchBox");

  if (!input) return;

  const query =
  input.value
  .trim()
  .toUpperCase();

  if (query === "") return;

  if (typeof satellites === "undefined")
    return;

  const found =
  satellites.find(

    sat=>

    sat.name
    .toUpperCase()
    .includes(query)

  );

  if (found) {

    if (typeof map !== "undefined") {

      map.setView(

        [found.lat, found.lng],

        6

      );

    }

    if (typeof highlightSatellite === "function") {

      highlightSatellite(found.name);

    }

    showSatelliteInfo(found);

    addTimeline(

      "Selected "+found.name

    );

  } else {

    document
    .getElementById("objectInfo")
    .innerHTML =

    "<h3>Satellite Not Found</h3>";

  }

}

// =======================================================
// ENTER KEY SEARCH
// =======================================================

document.addEventListener(

  "keydown",

  function(event) {

    if (event.key === "Enter") {

      searchObject();

    }

  }

);

// =======================================================
// AUTO CELESTRAK UPDATE
// =======================================================

setInterval(()=> {

  if (typeof loadCelesTrakTLE === "function") {

    loadCelesTrakTLE();

    addTimeline(

      "Orbital database refreshed"

    );

  }

}, 60000);

// =======================================================
// CONTINUOUS EARTH SYNC
// =======================================================

setInterval(()=> {

  syncEarth();

}, 3000);

// =======================================================
// APPLICATION START
// =======================================================

window.onload = ()=> {

  startupSequence();

  refreshMissionControl();

  if (typeof createObjects === "function") {

    createObjects();

  }

  if (typeof loadCelesTrakTLE === "function") {

    loadCelesTrakTLE();

  }

  setTimeout(()=> {

    syncEarth();

  }, 1500);

  addTimeline(

    "OrbitalGuard AI Ready"

  );

};// =======================================
// USER GUIDE TOGGLE
// =======================================

const guideButton =
document.getElementById("guideToggle");

const guideContent =
document.getElementById("guideContent");

if(guideButton && guideContent){

guideButton.onclick=function(){

guideContent.classList.toggle("show");

if(guideContent.classList.contains("show")){

guideButton.innerHTML=
"📖 Hide User Guide ▲";

}else{

guideButton.innerHTML=
"📖 Show User Guide ▼";

}

};

}