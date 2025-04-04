// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('webgl-output').appendChild(renderer.domElement);

// Create a 15x15x15 grid of cubes
const gridSize = 15;
const cubeSize = 1;
const cubes = [];

for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
            const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(x * cubeSize, y * cubeSize, z * cubeSize);
            cube.castShadow = true; // Enable shadow casting
            cube.userData = { id: `${x}-${y}-${z}` };
            cubes.push(cube);
            scene.add(cube);
        }
    }
}

// Create a plane to receive shadows
const planeGeometry = new THREE.PlaneGeometry(gridSize * cubeSize, gridSize * cubeSize);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true; // Enable shadow receiving
scene.add(plane);

// Add a directional light to simulate sunlight
const sunlight = new THREE.DirectionalLight(0xffffff, 1);
sunlight.position.set(5, 10, 7.5);
sunlight.castShadow = true; // Enable shadow casting

// Configure shadow properties
sunlight.shadow.mapSize.width = 1024;
sunlight.shadow.mapSize.height = 1024;
sunlight.shadow.camera.near = 0.5;
sunlight.shadow.camera.far = 50;
sunlight.shadow.camera.left = -10;
sunlight.shadow.camera.right = 10;
sunlight.shadow.camera.top = 10;
sunlight.shadow.camera.bottom = -10;

scene.add(sunlight);

// Add a point light source
const pointLight = new THREE.PointLight(0xff0000, 1, 100);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

camera.position.z = gridSize * cubeSize * 2;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Function to handle mouse clicks
function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(cubes);

    if (intersects.length > 0) {
        const intersectedCube = intersects[0].object;
        scene.remove(intersectedCube);
    }
}

window.addEventListener('click', onMouseClick, false);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

animate();
