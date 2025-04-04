// Setting up the scene, camera, and renderer
const container = document.getElementById('game-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Adding sunlight
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7); // Position of the light source
scene.add(light);

// Adding a grid of cubes
const cubeSize = 1;
const gridSize = 15;
const cubes = [];
const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

function getRandomColor() {
    return Math.floor(Math.random() * 16777215); // Generate a random color
}

for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
            const cubeMaterial = new THREE.MeshLambertMaterial({ color: getRandomColor() });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.set(x - gridSize / 2, y - gridSize / 2, z - gridSize / 2);
            scene.add(cube);
            cubes.push(cube);
        }
    }
}

camera.position.z = 40;

// Raycaster for precise click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cubes);

    if (intersects.length > 0) {
        const clickedCube = intersects[0].object;
        scene.remove(clickedCube);
        cubes.splice(cubes.indexOf(clickedCube), 1);
    }
}

window.addEventListener('click', onMouseClick);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
