AFRAME.registerComponent('camera-restriction', {
    tick: function () {
      const position = this.el.object3D.position;
      const maxRadius = 14;
      const maxY = 14;
      const minY = 1;

      const distanceFromCenter = Math.sqrt(position.x * position.x + position.z * position.z);

      if (distanceFromCenter > maxRadius) {
        const scale = maxRadius / distanceFromCenter;
        position.x *= scale;
        position.z *= scale;
      }

      if (position.y > maxY) position.y = maxY;
      if (position.y < minY) position.y = minY;
    }
});

const ship = document.getElementById('shipModel');

const relics = [
    "chest.gltf",
    "cutlass.gltf",
    "flintlock.gltf",
    "map.gltf",
    "compass.gltf",
    "spyglass.gltf",
    "cannon.gltf",
    "wheel.gltf",
    "hat.gltf",
    "barrel.gltf"
]

function addRelic(x, z, scene) {
    if (relics.length === 0) return;

    const randomIndex = Math.floor(Math.random() * relics.length);
    const relicPath = `assets/${relics.splice(randomIndex, 1)[0]}`;

    const relic = document.createElement('a-entity');
    relic.setAttribute('gltf-model', relicPath);
    relic.setAttribute('position', `${x} 0.6 ${z}`);
    relic.setAttribute('scale', '0.2 0.2 0.2');
    scene.appendChild(relic);
    rotateObject(relic, 1);
}

function setUpStands() {
    const numberOfStands = 10;
    const pathWidth = 8;
    const angle = (360/numberOfStands) * Math.PI/180;
    const scene = document.querySelector('a-scene');
    for (let i = 0; i < numberOfStands; i++) {
        let xValue = Math.cos(angle * i) * pathWidth;
        let zValue = Math.sin(angle * i) * pathWidth;
        const stand = document.createElement('a-entity');
        stand.setAttribute('class', 'standModel');
        stand.setAttribute('gltf-model', '#stand');
        stand.setAttribute('position', `${xValue} 0 ${zValue}`);
        stand.setAttribute('scale', '0.25 0.25 0.25');
        stand.setAttribute('static-body', '');
        
        addRelic(xValue, zValue, scene)

        scene.appendChild(stand);
    }
}

function rotateObject(obj, velocity) {
    const rotateObj = () => {
        const prevRotation = obj.getAttribute('rotation').y;
        obj.setAttribute('rotation', { x: 0, y: prevRotation + velocity, z: 0 });

        requestAnimationFrame(rotateObj);
    };

    rotateObj();
}

let modelsLoaded = 0;
const totalModels = 3 + relics.length;

const scene = document.querySelector('a-scene');

ship.addEventListener('loaded', rotateObject(ship, 0.75))

setUpStands();