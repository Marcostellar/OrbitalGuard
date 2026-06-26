// =====================================================
// ORBITALGUARD AI
// EARTH3D.JS - PART 1
// Scene, Camera, Earth & Orbit Rings
// =====================================================

// -------------------------
// Container
// -------------------------

const earthContainer = document.getElementById("earth3d");

if (!earthContainer) {
  throw new Error("Missing <div id='earth3d'>");
}

// -------------------------
// Scene
// -------------------------

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x000000);

// -------------------------
// Camera
// -------------------------

const camera = new THREE.PerspectiveCamera(
  45,
  earthContainer.clientWidth / earthContainer.clientHeight,
  0.1,
  2000
);

// IMPORTANT

camera.position.set(0, 6, 18);

camera.lookAt(0, 0, 0);

// -------------------------
// Renderer
// -------------------------

const renderer = new THREE.WebGLRenderer({

  antialias: true,

  alpha: false

});

renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(

  earthContainer.clientWidth,

  earthContainer.clientHeight

);

renderer.setClearColor(0x000000);

earthContainer.appendChild(renderer.domElement);

// =====================================================
// LIGHTING
// =====================================================

const ambientLight =

new THREE.AmbientLight(

  0xffffff,

  0.55

);

scene.add(ambientLight);

const sunLight =

new THREE.DirectionalLight(

  0xffffff,

  1.4

);

sunLight.position.set(

  20,

  15,

  20

);

scene.add(sunLight);

// =====================================================
// EARTH
// =====================================================

const textureLoader =

new THREE.TextureLoader();

const earthGeometry =

new THREE.SphereGeometry(

  5,

  64,

  64

);

let earthMaterial =

new THREE.MeshPhongMaterial({

  color: 0x1f6fff

});

const earth =

new THREE.Mesh(

  earthGeometry,

  earthMaterial

);

earth.rotation.z =

THREE.MathUtils.degToRad(

  23.5

);

scene.add(earth);

// =====================================================
// LOAD TEXTURE
// =====================================================

textureLoader.load(

  "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",

  function(texture) {

    earth.material =

    new THREE.MeshPhongMaterial({

      map: texture

    });

  },

  undefined,

  function() {

    console.log(

      "Texture failed to load. Using blue Earth."

    );

  }

);

// =====================================================
// EARTH GLOW
// =====================================================

const glowGeometry =

new THREE.SphereGeometry(

  5.15,

  64,

  64

);

const glowMaterial =

new THREE.MeshBasicMaterial({

  color: 0x44aaff,

  transparent: true,

  opacity: 0.15

});

const atmosphere =

new THREE.Mesh(

  glowGeometry,

  glowMaterial

);

scene.add(atmosphere);

// =====================================================
// STARFIELD
// =====================================================

const starGeometry =

new THREE.BufferGeometry();

const starVertices = [];

for (let i = 0; i < 9000; i++) {

  starVertices.push(

    (Math.random()-0.5)*2500,

    (Math.random()-0.5)*2500,

    (Math.random()-0.5)*2500

  );

}

starGeometry.setAttribute(

  "position",

  new THREE.Float32BufferAttribute(

    starVertices,

    3

  )

);

const starMaterial =

new THREE.PointsMaterial({

  color: 0xffffff,

  size: 0.8

});

const stars =

new THREE.Points(

  starGeometry,

  starMaterial

);

scene.add(stars);

// =====================================================
// ORBIT RINGS
// =====================================================

function addOrbit(radius, color) {

  const ring =

  new THREE.Mesh(

    new THREE.TorusGeometry(

      radius,

      0.03,

      16,

      150

    ),

    new THREE.MeshBasicMaterial({

      color: color

    })

  );

  ring.rotation.x =

  Math.PI/2;

  scene.add(ring);

}

addOrbit(7, 0x00ff00);

addOrbit(10, 0xff9900);

addOrbit(13, 0xff0000);

// =====================================================
// DEBUG AXES
// =====================================================

// Uncomment if needed

// scene.add(new THREE.AxesHelper(10));

// =====================================================
// SATELLITE STORAGE
// =====================================================

const satelliteMeshes = [];
// =====================================================
// EARTH3D.JS - PART 2
// Satellites, Animation & Synchronization
// =====================================================

// ----------------------------------------
// BUILD SATELLITE MESHES
// ----------------------------------------

function buildSatelliteMeshes(objects){

    // Remove old satellites

    satelliteMeshes.forEach(mesh=>{

        scene.remove(mesh);

    });

    satelliteMeshes.length = 0;

    objects.forEach(obj=>{

        let radius = 7;
        let color = 0x00ff00;

        if(obj.orbit==="MEO"){

            radius = 10;
            color = 0xff9900;

        }

        if(obj.orbit==="GEO"){

            radius = 13;
            color = 0xff3333;

        }

        const mesh = new THREE.Mesh(

            new THREE.SphereGeometry(
                0.10,
                10,
                10
            ),

            new THREE.MeshBasicMaterial({

                color:color

            })

        );

        mesh.userData = {

            object:obj,
            radius:radius

        };

        satelliteMeshes.push(mesh);

        scene.add(mesh);

    });

}

// ----------------------------------------
// UPDATE SATELLITE POSITIONS
// ----------------------------------------

function updateSatelliteMeshes(){

    satelliteMeshes.forEach(mesh=>{

        const sat = mesh.userData.object;

        const lat =
        THREE.MathUtils.degToRad(
            sat.lat
        );

        const lon =
        THREE.MathUtils.degToRad(
            sat.lng
        );

        const r =
        mesh.userData.radius;

        mesh.position.x =
        r*Math.cos(lat)*Math.cos(lon);

        mesh.position.y =
        r*Math.sin(lat);

        mesh.position.z =
        r*Math.cos(lat)*Math.sin(lon);

    });

}

// ----------------------------------------
// HIGHLIGHT SEARCHED SATELLITE
// ----------------------------------------

function highlightSatellite(name){

    satelliteMeshes.forEach(mesh=>{

        if(mesh.userData.object.name===name){

            mesh.material.color.set(
                0x00ffff
            );

            mesh.scale.set(
                2,
                2,
                2
            );

        }

        else{

            let colour = 0x00ff00;

            if(mesh.userData.object.orbit==="MEO")
                colour = 0xff9900;

            if(mesh.userData.object.orbit==="GEO")
                colour = 0xff3333;

            mesh.material.color.set(colour);

            mesh.scale.set(
                1,
                1,
                1
            );

        }

    });

}

// ----------------------------------------
// EARTH ROTATION
// ----------------------------------------

function rotateEarth(){

    earth.rotation.y += 0.0015;

    atmosphere.rotation.y += 0.0015;

    stars.rotation.y += 0.00015;

}

// ----------------------------------------
// ANIMATION LOOP
// ----------------------------------------

function animate(){

    requestAnimationFrame(
        animate
    );

    rotateEarth();

    updateSatelliteMeshes();

    renderer.render(
        scene,
        camera
    );

}

animate();

// ----------------------------------------
// RESPONSIVE RESIZE
// ----------------------------------------

window.addEventListener(

"resize",

()=>{

    const width =
    earthContainer.clientWidth;

    const height =
    earthContainer.clientHeight;

    camera.aspect =
    width/height;

    camera.updateProjectionMatrix();

    renderer.setSize(
        width,
        height
    );

}

);

// ----------------------------------------
// AUTO CAMERA ORBIT
// ----------------------------------------

let cameraAngle = 0;

function orbitCamera(){

    cameraAngle += 0.002;

    camera.position.x =
    Math.sin(cameraAngle)*18;

    camera.position.z =
    Math.cos(cameraAngle)*18;

    camera.lookAt(
        0,
        0,
        0
    );

}

setInterval(

orbitCamera,

40

);

// ----------------------------------------
// STARTUP
// ----------------------------------------

console.log(
"Earth 3D Engine Loaded Successfully"
);