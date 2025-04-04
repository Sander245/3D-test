// Setting up the scene, camera, and renderer
const container = document.getElementById('game-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Adding ambient and directional light
const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Soft ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Sunlight-like light
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

// Camera rotation using arrow keys
function onArrowKey(event) {
    const rotationSpeed = 0.05;
    switch (event.key) {
        case "ArrowUp":
            camera.position.y += rotationSpeed * 10;
            break;
        case "ArrowDown":
            camera.position.y -= rotationSpeed * 10;
            break;
        case "ArrowLeft":
            camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationSpeed);
            break;
        case "ArrowRight":
            camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -rotationSpeed);
            break;
    }
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

window.addEventListener('keydown', onArrowKey);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
