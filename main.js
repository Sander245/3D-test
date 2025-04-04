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

// Ambient and directional light
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

// Raycaster for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Variables to track mouse movement
let isDragging = false;
let clickStart = { x: 0, y: 0 };

function createExplosion(position) {
    const particleGeometry = new THREE.SphereGeometry(0.1, 4, 4);
    const particleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.copy(position);
    scene.add(particle);

    const velocity = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    let lifespan = 20;

    function animateExplosion() {
        if (lifespan-- > 0) {
            particle.position.add(velocity);
            requestAnimationFrame(animateExplosion);
        } else {
            scene.remove(particle);
        }
    }
    animateExplosion();
}

function onMouseDown(event) {
    isDragging = false;
    clickStart.x = event.clientX;
    clickStart.y = event.clientY;
}

function onMouseMove(event) {
    const deltaX = event.clientX - clickStart.x;
    const deltaY = event.clientY - clickStart.y;

    // Check if the mouse has moved enough to qualify as dragging
    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        isDragging = true;

        const rotationSpeed = 0.005;
        camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -deltaX * rotationSpeed);
        camera.position.y -= deltaY * rotationSpeed * 10;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        clickStart.x = event.clientX;
        clickStart.y = event.clientY;
    }
}

function onMouseUp(event) {
    // If not dragging, it's a click
    if (!isDragging) {
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
}

container.addEventListener('mousedown', onMouseDown);
container.addEventListener('mousemove', onMouseMove);
container.addEventListener('mouseup', onMouseUp);

// Zoom with mouse wheel
function onWheel(event) {
    camera.position.z += event.deltaY * 0.01;
}

container.addEventListener('wheel', onWheel);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
