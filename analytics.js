// ======================================================
// ORBITALGUARD AI
// analytics.js
// Phase 7A
// Chart.js Analytics Engine
// ======================================================

// ======================================================
// GLOBAL CHART OBJECTS
// ======================================================

let orbitChart = null;
let altitudeChart = null;
let velocityChart = null;
let massChart = null;

// ======================================================
// INITIALIZE ANALYTICS
// ======================================================

function initializeAnalytics() {

    createOrbitChart();

    createAltitudeChart();

    createVelocityChart();

    createMassChart();

}

// ======================================================
// COMMON CHART OPTIONS
// ======================================================

const chartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    animation: {

        duration: 1000

    },

    plugins: {

        legend: {

            labels: {

                color: "#ffffff",

                font: {

                    size: 13

                }

            }

        }

    },

    scales: {

        x: {

            ticks: {

                color: "#00d8ff"

            },

            grid: {

                color: "rgba(255,255,255,0.08)"

            }

        },

        y: {

            beginAtZero: true,

            ticks: {

                color: "#00d8ff"

            },

            grid: {

                color: "rgba(255,255,255,0.08)"

            }

        }

    }

};

// ======================================================
// ORBIT DISTRIBUTION
// ======================================================

function createOrbitChart() {

    const canvas =
    document.getElementById("orbitChart");

    if (!canvas) return;

    orbitChart = new Chart(canvas, {

        type: "doughnut",

        data: {

            labels: [

                "LEO",

                "MEO",

                "GEO"

            ],

            datasets: [{

                data: [0,0,0],

                backgroundColor: [

                    "#00ff88",

                    "#ffaa00",

                    "#ff4444"

                ],

                borderWidth: 1

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    labels: {

                        color: "#ffffff"

                    }

                }

            }

        }

    });

}

// ======================================================
// ALTITUDE CHART
// ======================================================

function createAltitudeChart() {

    const canvas =
    document.getElementById("altitudeChart");

    if (!canvas) return;

    altitudeChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: [

                "LEO",

                "MEO",

                "GEO"

            ],

            datasets: [{

                label: "Average Altitude (km)",

                data: [0,0,0]

            }]

        },

        options: chartOptions

    });

}
// ======================================================
// VELOCITY CHART
// ======================================================

function createVelocityChart() {

    const canvas =
    document.getElementById("velocityChart");

    if (!canvas) return;

    velocityChart = new Chart(canvas, {

        type: "line",

        data: {

            labels: [

                "Slow",
                "Medium",
                "Fast"

            ],

            datasets: [{

                label: "Objects",

                data: [0,0,0],

                borderColor: "#00d8ff",

                backgroundColor:
                "rgba(0,216,255,0.25)",

                tension: 0.4,

                fill: true

            }]

        },

        options: chartOptions

    });

}

// ======================================================
// MASS DISTRIBUTION
// ======================================================

function createMassChart() {

    const canvas =
    document.getElementById("massChart");

    if (!canvas) return;

    massChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: [

                "<500kg",
                "500-3000kg",
                ">3000kg"

            ],

            datasets: [{

                label: "Debris Count",

                data: [0,0,0],

                backgroundColor: [

                    "#00ff88",
                    "#ffaa00",
                    "#ff4444"

                ]

            }]

        },

        options: chartOptions

    });

}

// ======================================================
// UPDATE ALL CHARTS
// ======================================================

function updateAnalytics() {

    if (
        typeof satellites === "undefined" ||
        satellites.length === 0
    ) return;

    // -------------------------
    // Orbit Distribution
    // -------------------------

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

    orbitChart.data.datasets[0].data = [

        leo,
        meo,
        geo

    ];

    orbitChart.update();

    // -------------------------
    // Average Altitude
    // -------------------------

    function average(list){

        if(list.length===0)
            return 0;

        return Math.round(

            list.reduce(

                (sum,obj)=>

                sum+obj.altitude,

                0

            )/list.length

        );

    }

    altitudeChart.data.datasets[0].data=[

        average(
            satellites.filter(
                s=>s.orbit==="LEO"
            )
        ),

        average(
            satellites.filter(
                s=>s.orbit==="MEO"
            )
        ),

        average(
            satellites.filter(
                s=>s.orbit==="GEO"
            )
        )

    ];

    altitudeChart.update();

    // -------------------------
    // Velocity Distribution
    // -------------------------

    let slow=0;
    let medium=0;
    let fast=0;

    satellites.forEach(obj=>{

        if(obj.speed<7.3){

            slow++;

        }

        else if(obj.speed<7.8){

            medium++;

        }

        else{

            fast++;

        }

    });

    velocityChart.data.datasets[0].data=[

        slow,
        medium,
        fast

    ];

    velocityChart.update();

    // -------------------------
    // Mass Distribution
    // -------------------------

    let light=0;
    let averageMass=0;
    let heavy=0;

    satellites.forEach(obj=>{

        if(obj.mass<500){

            light++;

        }

        else if(obj.mass<3000){

            averageMass++;

        }

        else{

            heavy++;

        }

    });

    massChart.data.datasets[0].data=[

        light,
        averageMass,
        heavy

    ];

    massChart.update();

}

// ======================================================
// AUTO UPDATE
// ======================================================

setInterval(function(){

    updateAnalytics();

},3000);

// ======================================================
// INITIALIZE
// ======================================================

document.addEventListener(

    "DOMContentLoaded",

    function(){

        initializeAnalytics();

    }

);