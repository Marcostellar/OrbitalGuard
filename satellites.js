// =====================================================
// ORBITALGUARD AI
// satellites.js (Part 1)
// Satellite Engine Foundation
// =====================================================


// =====================================================
// LEAFLET MAP
// =====================================================

const map = L.map("map", {

    zoomControl: true,

    worldCopyJump: true,

    minZoom: 2,

    maxZoom: 8

}).setView([20,0],2);


L.tileLayer(

"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

{

attribution:"© OpenStreetMap Contributors",

maxZoom:8

}

).addTo(map);


L.control.scale().addTo(map);


// =====================================================
// GLOBAL COLLECTIONS
// =====================================================

let satellites = [];

let markers = [];

let orbitLines = [];

let captureTargets = [];

let collisionPairs = [];


// =====================================================
// SATELLITE CLASS
// =====================================================

class OrbitalObject{

constructor(data){

this.id =
data.id || "";

this.name =
data.name || "UNKNOWN";

this.orbit =
data.orbit || "LEO";

this.lat =
data.lat || 0;

this.lng =
data.lng || 0;

this.altitude =
data.altitude || 0;

this.speed =
data.speed || 7.8;

this.mass =
data.mass || 0;

this.risk =
data.risk || 0;

this.priority =
data.priority || "LOW";

this.status =
data.status || "ACTIVE";

}

}


// =====================================================
// ORBIT COLOUR
// =====================================================

function orbitColor(orbit){

switch(orbit){

case "LEO":

return "#00ff88";

case "MEO":

return "#ff9900";

case "GEO":

return "#ff3333";

case "DEBRIS":

return "#ffff00";

default:

return "#00d8ff";

}

}


// =====================================================
// RANDOM MASS
// =====================================================

function randomMass(){

return Math.floor(

Math.random()*9000+100

);

}


// =====================================================
// RANDOM COLLISION RISK
// =====================================================

function randomRisk(){

return Math.floor(

Math.random()*100

);

}


// =====================================================
// AI PRIORITY
// =====================================================

function determinePriority(risk){

if(risk>=75)

return "HIGH";

if(risk>=40)

return "MEDIUM";

return "LOW";

}


// =====================================================
// CREATE SATELLITE
// =====================================================

function createSatellite(data){

const risk =
randomRisk();

const mass =
randomMass();

return new OrbitalObject({

id:data.id,

name:data.name,

orbit:data.orbit,

lat:data.lat,

lng:data.lng,

altitude:data.altitude,

speed:data.speed,

status:data.status,

mass:mass,

risk:risk,

priority:

determinePriority(risk)

});

}


// =====================================================
// REMOVE EXISTING OBJECTS
// =====================================================

function clearMap(){

markers.forEach(marker=>{

map.removeLayer(marker);

});

markers=[];


orbitLines.forEach(line=>{

map.removeLayer(line);

});

orbitLines=[];

}


// =====================================================
// FIND SATELLITE
// =====================================================

function getSatellite(name){

return satellites.find(

sat=>

sat.name===name

);

}


// =====================================================
// COUNT ORBITS
// =====================================================

function orbitStatistics(){

return{

LEO:

satellites.filter(

s=>s.orbit==="LEO"

).length,

MEO:

satellites.filter(

s=>s.orbit==="MEO"

).length,

GEO:

satellites.filter(

s=>s.orbit==="GEO"

).length

};

}


// =====================================================
// FASTEST OBJECT
// =====================================================

function fastestSatellite(){

if(satellites.length===0)

return null;

return satellites.reduce(

(a,b)=>

a.speed>b.speed

?

a

:

b

);

}


// =====================================================
// TOTAL DEBRIS MASS
// =====================================================

function totalDebrisMass(){

return satellites.reduce(

(total,obj)=>

total+obj.mass,

0

);

}


// =====================================================
// AVERAGE SPEED
// =====================================================

function averageSpeed(){

if(satellites.length===0)

return 0;

return(

satellites.reduce(

(sum,obj)=>

sum+obj.speed,

0

)

/

satellites.length

);

}


// =====================================================
// END OF PART 1
// =====================================================// =====================================================
// SATELLITE MARKER ENGINE
// satellites.js (Part 2)
// =====================================================


// =====================================================
// CREATE MARKER
// =====================================================

function createMarker(object){

const marker =

L.circleMarker(

[object.lat, object.lng],

{

radius:6,

color:orbitColor(object.orbit),

fillColor:orbitColor(object.orbit),

fillOpacity:0.9,

weight:1

}

)

.addTo(map);


marker.bindPopup(

`

<b>${object.name}</b>

<hr>

Orbit: ${object.orbit}<br>

Altitude: ${object.altitude} km<br>

Velocity: ${object.speed.toFixed(2)} km/s<br>

Risk: ${object.risk}%<br>

Priority: ${object.priority}

`

);


marker.on("click",()=>{

showSatelliteInfo(object);

highlightSatellite(object.name);

addTimeline(

"Viewing "+object.name

);

});


markers.push(marker);

return marker;

}



// =====================================================
// ORBIT TRAIL
// =====================================================

function createOrbitTrail(object){

const orbit =

L.polyline(

[

[

object.lat,

object.lng

],

[

object.lat+

(Math.random()*4-2),

object.lng+

(Math.random()*4-2)

]

],

{

color:orbitColor(object.orbit),

weight:1,

opacity:0.6,

dashArray:"6,6"

}

)

.addTo(map);


orbitLines.push(orbit);

}



// =====================================================
// DRAW ALL OBJECTS
// =====================================================

function drawSatellites(){

clearMap();

satellites.forEach(object=>{

createMarker(object);

createOrbitTrail(object);

});

}



// =====================================================
// LOAD SIMULATION
// (temporary until CelesTrak)
// =====================================================

function createObjects(){

satellites=[];

for(

let i=0;

i<300;

i++

){

const altitude=

Math.floor(

Math.random()*36000

);


let orbit="LEO";

if(

altitude>2000

)

orbit="MEO";

if(

altitude>35786

)

orbit="GEO";


const satellite=

createSatellite({

id:10000+i,

name:"OBJECT-"+i,

orbit:orbit,

lat:

Math.random()*180-90,

lng:

Math.random()*360-180,

altitude:altitude,

speed:

7+

Math.random(),

status:"ACTIVE"

});


satellites.push(

satellite

);

}


drawSatellites();

refreshMissionControl();

syncEarth();

}



// =====================================================
// SATELLITE MOVEMENT
// =====================================================

function moveObjects(){

satellites.forEach(object=>{

object.lng+=0.15;

if(

object.lng>180

){

object.lng=-180;

}

});


drawSatellites();

syncEarth();

}



// =====================================================
// HIGHLIGHT CAPTURE TARGET
// =====================================================

function updateCaptureTarget(){

if(

satellites.length===0

)

return;


const sorted=[

...satellites

].sort(

(a,b)=>

b.risk-a.risk

);


const target=

sorted[0];


document

.getElementById(

"captureTarget"

)

.innerHTML=

target.name;


captureTargets=[

target

];

}



// =====================================================
// COLLISION ANALYSIS
// =====================================================

function detectCollisions(){

collisionPairs=[];

let count=0;


for(

let i=0;

i<satellites.length;

i++

){

for(

let j=i+1;

j<satellites.length;

j++

){

const a=

satellites[i];

const b=

satellites[j];


const dLat=

Math.abs(

a.lat-b.lat

);

const dLng=

Math.abs(

a.lng-b.lng

);


if(

dLat<0.8&&

dLng<0.8

){

count++;

collisionPairs.push({

a,

b

});

}

}

}


return count;

}



// =====================================================
// UPDATE SATELLITE POSITIONS
// =====================================================

function updateSatelliteEngine(){

moveObjects();

updateCaptureTarget();

refreshMissionControl();

}



// =====================================================
// START ENGINE
// =====================================================

createObjects();

setInterval(

updateSatelliteEngine,

5000

);