// Setting up the scene, camera, and renderer
const container = document.getElementById('game-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Currency counter
let currency = 0;
const currencyCounter = document.getElementById("currency-counter");

// Adding ambient and directional light
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Cube grid setup
const cubeSize = 1;
const gridSize = 15;
const cubes = [];
const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

function getRandomColor() {
    return Math.floor(Math.random() * 16777215); // Random hex color
}

for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
            const cubeMaterial = new THREE.MeshStandardMaterial({ color: getRandomColor() });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.set(x - gridSize / 2, y - gridSize / 2, z - gridSize / 2);
            scene.add(cube);
            cubes.push(cube);
        }
    }
}

camera.position.set(25, 25, 25);
camera.lookAt(0, 0, 0);

// Controls for dragging the camera and zoom
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

function onMouseDown(event) {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
}

function onMouseMove(event) {
    if (!isDragging) return;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;
    const rotationSpeed = 0.005;

    camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -deltaX * rotationSpeed);
    camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), deltaY * rotationSpeed);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    previousMousePosition = { x: event.clientX, y: event.clientY };
}

function onMouseUp() {
    isDragging = false;
}

function onWheel(event) {
    camera.position.z += event.deltaY * 0.01;
}

container.addEventListener("mousedown", onMouseDown);
container.addEventListener("mousemove", onMouseMove);
container.addEventListener("mouseup", onMouseUp);
container.addEventListener("wheel", onWheel);

// Block explosion effect and currency update
function createExplosion(position) {
    const particleGeometry = new THREE.SphereGeometry(0.1, 4, 4);
    const particleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.copy(position);
    scene.add(particle);

    const particleVelocity = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    const explodeTime = 30;

    let timer = 0;
    function explode() {
        if (timer++ < explodeTime) {
            particle.position.add(particleVelocity);
            requestAnimationFrame(explode);
        } else {
            scene.remove(particle);
        }
    }
    explode();
}

// Raycaster for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cubes);

    if (intersects.length > 0) {
        const clickedCube = intersects[0].object;
        createExplosion(clickedCube.position);
        scene.remove(clickedCube);
        cubes.splice(cubes.indexOf(clickedCube), 1);
        currency++;
        currencyCounter.textContent = `Currency: ${currency}`;
    }
}

container.addEventListener('click', onMouseClick);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
