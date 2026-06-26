// ======================================
// ORBITALGUARD AI
// DASHBOARD ENGINE
// ======================================

function updateDashboard() {

  if (!satellites || satellites.length === 0) {

    document.getElementById("status").innerHTML =
    "Waiting for satellite data...";

    return;

  }

  // ===============================
  // BASIC COUNTS
  // ===============================

  document.getElementById("objects").innerHTML =
  satellites.length;

  const leo =
  satellites.filter(
    s => s.orbit === "LEO"
  ).length;

  const meo =
  satellites.filter(
    s => s.orbit === "MEO"
  ).length;

  const geo =
  satellites.filter(
    s => s.orbit === "GEO"
  ).length;

  // These require ids in index.html
  if (document.getElementById("leo"))
    document.getElementById("leo").innerHTML = leo;

  if (document.getElementById("meo"))
    document.getElementById("meo").innerHTML = meo;

  if (document.getElementById("geo"))
    document.getElementById("geo").innerHTML = geo;

  // ===============================
  // FASTEST OBJECT
  // ===============================

  const fastest = satellites.reduce(

    (a, b)=>

    a.speed > b.speed ? a: b

  );

  document.getElementById("fastest").innerHTML =

  fastest.speed.toFixed(2)+" km/s";

  // ===============================
  // AVERAGE SPEED
  // ===============================

  const averageSpeed =

  satellites.reduce(

    (sum, obj)=>sum+obj.speed,

    0

  ) / satellites.length;

  document.getElementById("avgSpeed").innerHTML =

  averageSpeed.toFixed(2)+" km/s";

  // ===============================
  // SIMULATED DEBRIS MASS
  // ===============================

  let totalMass = 0;

  satellites.forEach(obj => {

    // Assign a mass if it doesn't exist

    if (!obj.mass) {

      obj.mass =

      Math.floor(

        5 +

        Math.random()*1500

      );

    }

    totalMass += obj.mass;

  });

  // Requires this element in HTML:
  // <p id="debrisMass"></p>

  if (document.getElementById("debrisMass")) {

    document.getElementById("debrisMass").innerHTML =

    totalMass.toLocaleString()+" kg";

  }

  // ===============================
  // COLLISION RISK
  // ===============================

  const collisions =

  calculateCollisionRisk();

  document.getElementById("collisions").innerHTML =

  collisions;

  // ===============================
  // THREAT LEVEL
  // ===============================

  let threat = "LOW";

  if (collisions > 5)
    threat = "MEDIUM";

  if (collisions > 15)
    threat = "HIGH";

  if (collisions > 30)
    threat = "CRITICAL";

  document.getElementById("threatLevel").innerHTML =

  threat;

  // ===============================
  // AI TARGET
  // ===============================

  const target =

  recommendCaptureTarget();

  document.getElementById("captureTarget").innerHTML =

  target.name;

  // ===============================
  // SYSTEM STATUS
  // ===============================

  document.getElementById("status").innerHTML =

  "Mission Control Active";

  // ===============================
  // WARNING PANEL
  // ===============================

  const warning =

  document.getElementById("warningBox");

  if (threat === "LOW") {

    warning.innerHTML =
    "✅ Orbital Traffic Stable";

  } else if (threat === "MEDIUM") {

    warning.innerHTML =
    "🟡 🟡🟡Moderate Orbital Congestion";

  } else if (threat === "HIGH") {

    warning.innerHTML =
    " ⚠️High Collision Risk";

  } else {

    warning.innerHTML =
    "🔴 🔴🔴Critical Collision Warning";

  }

}

// ======================================
// AUTO REFRESH
// ======================================

setInterval(

  updateDashboard,

  2000

);
if (typeof updateAnalytics === "function") {

    updateAnalytics();

}