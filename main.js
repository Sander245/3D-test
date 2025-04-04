let grid = [];
let gridSize = 15;
let cubeSize = 20; // Size of each cube
let angleX = 0, angleY = 0;
let isDragging = false;
let previousMouse = { x: 0, y: 0 };
let zoom = 600;
let currency = 0;

// Setup function for p5.js
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    // Disable browser's default pinch-to-zoom
    document.body.addEventListener('gesturestart', (e) => e.preventDefault());

    // Create a grid of cubes
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            for (let z = 0; z < gridSize; z++) {
                let color = [random(255), random(255), random(255)];
                grid.push({ x: x * cubeSize, y: y * cubeSize, z: z * cubeSize, color });
            }
        }
    }
}

// Draw function for p5.js
function draw() {
    background(30);
    lights();

    // Camera controls
    translate(0, 0, -zoom);
    rotateX(angleX);
    rotateY(angleY);

    // Draw cubes
    for (let i = grid.length - 1; i >= 0; i--) {
        const cube = grid[i];
        push();
        translate(cube.x - (gridSize / 2) * cubeSize, cube.y - (gridSize / 2) * cubeSize, cube.z - (gridSize / 2) * cubeSize);
        fill(cube.color);
        stroke(0);
        box(cubeSize);
        pop();
    }

    // Display currency counter
    document.getElementById('currency-counter').textContent = `Currency: ${currency}`;
}

// Mouse drag for camera orbit
function mouseDragged() {
    if (!isDragging) return;
    angleY += (mouseX - previousMouse.x) * 0.01;
    angleX += (mouseY - previousMouse.y) * 0.01;
    previousMouse = { x: mouseX, y: mouseY };
}

// Detect block click
function mousePressed() {
    isDragging = true;
    previousMouse = { x: mouseX, y: mouseY };

    // Convert mouse click to 3D space
    const ray = createVector(mouseX - width / 2, mouseY - height / 2, -zoom);
    for (let i = grid.length - 1; i >= 0; i--) {
        let cube = grid[i];
        let cubeCenter = createVector(
            cube.x - (gridSize / 2) * cubeSize,
            cube.y - (gridSize / 2) * cubeSize,
            cube.z - (gridSize / 2) * cubeSize
        );

        if (p5.Vector.dist(ray, cubeCenter) < cubeSize / 2) {
            // Remove clicked cube
            grid.splice(i, 1);

            // Add explosion effect
            for (let j = 0; j < 10; j++) {
                let particle = {
                    x: cubeCenter.x,
                    y: cubeCenter.y,
                    z: cubeCenter.z,
                    velocity: createVector(random(-1, 1), random(-1, 1), random(-1, 1)),
                    lifespan: 30,
                };
                grid.push(particle); // Add particle effect to grid
            }

            currency++;
            break;
        }
    }
}

// Mouse release for camera control
function mouseReleased() {
    isDragging = false;
}

// Mouse wheel for zoom
function mouseWheel(event) {
    zoom += event.deltaY * 5;
}
