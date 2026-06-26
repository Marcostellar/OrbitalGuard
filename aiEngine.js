// =====================================================
// ORBITALGUARD AI
// aiEngine.js
// Phase 7B
// AI Mission Intelligence Engine
// =====================================================

// =====================================================
// AI STATE
// =====================================================

const aiEngine = {

  highestRisk: null,

  fastestObject: null,

  largestObject: null,

  captureCandidate: null,

  averageRisk: 0,

  confidence: 98.7,

  readiness: 100

};

// =====================================================
// UPDATE AI
// =====================================================

function updateAIEngine() {

  if (
    typeof satellites === "undefined" ||
    satellites.length === 0
  ) return;

  findHighestRisk();

  findFastestObject();

  findLargestObject();

  findCaptureCandidate();

  calculateAverageRisk();

  updateMissionPanel();

}

// =====================================================
// HIGHEST RISK
// =====================================================

function findHighestRisk() {

  aiEngine.highestRisk =
  satellites.reduce(

    (a, b)=>

    a.risk > b.risk ? a: b

  );

}

// =====================================================
// FASTEST OBJECT
// =====================================================

function findFastestObject() {

  aiEngine.fastestObject =
  satellites.reduce(

    (a, b)=>

    a.speed > b.speed ? a: b

  );

}

// =====================================================
// LARGEST OBJECT
// =====================================================

function findLargestObject() {

  aiEngine.largestObject =
  satellites.reduce(

    (a, b)=>

    a.mass > b.mass ? a: b

  );

}

// =====================================================
// CAPTURE TARGET
// =====================================================

function findCaptureCandidate() {

  const sorted =

  [...satellites].sort(

    (a, b)=>

    (b.risk+b.mass/1000)

    -

    (a.risk+a.mass/1000)

  );

  aiEngine.captureCandidate = sorted[0];

}// =====================================================
// AVERAGE RISK
// =====================================================

function calculateAverageRisk() {

    let totalRisk = satellites.reduce(

        (sum, obj) => sum + obj.risk,

        0

    );

    aiEngine.averageRisk = (

        totalRisk / satellites.length

    ).toFixed(1);

}

// =====================================================
// COLLISION HOTSPOT
// =====================================================

function detectCollisionHotspot() {

    if (
        typeof collisionPairs === "undefined" ||
        collisionPairs.length === 0
    ) {

        return "None";

    }

    return collisionPairs[0].a.name;

}

// =====================================================
// UPDATE PANEL
// =====================================================

function updateMissionPanel() {

    const highestRisk =
    document.getElementById("highestRisk");

    const fastest =
    document.getElementById("fastestObject");

    const largest =
    document.getElementById("largestObject");

    const capture =
    document.getElementById("captureCandidate");

    const confidence =
    document.getElementById("aiConfidence");

    const readiness =
    document.getElementById("missionReadiness");

    const averageRisk =
    document.getElementById("averageRisk");

    const hotspot =
    document.getElementById("collisionHotspot");

    if (highestRisk)

        highestRisk.innerHTML =
        aiEngine.highestRisk.name;

    if (fastest)

        fastest.innerHTML =
        aiEngine.fastestObject.name;

    if (largest)

        largest.innerHTML =
        aiEngine.largestObject.name;

    if (capture)

        capture.innerHTML =
        aiEngine.captureCandidate.name;

    if (confidence)

        confidence.innerHTML =
        aiEngine.confidence + "%";

    if (readiness)

        readiness.innerHTML =
        aiEngine.readiness + "%";

    if (averageRisk)

        averageRisk.innerHTML =
        aiEngine.averageRisk + "%";

    if (hotspot)

        hotspot.innerHTML =
        detectCollisionHotspot();

}

// =====================================================
// MAIN AI UPDATE
// =====================================================

function updateAIEngine() {

    if (
        typeof satellites === "undefined" ||
        satellites.length === 0
    ) return;

    findHighestRisk();

    findFastestObject();

    findLargestObject();

    findCaptureCandidate();

    calculateAverageRisk();

    updateMissionPanel();

}

// =====================================================
// AUTO UPDATE
// =====================================================

setInterval(updateAIEngine, 3000);

// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(

    "DOMContentLoaded",

    function () {

        updateAIEngine();

    }

);