import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const objects = []; //list of scene objects
let raycaster; //raygun

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let camera, scene, renderer, controls;

init();
animate();
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 10;

    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    instructions.addEventListener('click', function () {
        controls.lock();
    });
    controls.addEventListener('lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    });
    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = '';
    });

    scene.add(controls.getObject());

    const onKeyDown = function (event) {
        switch (event.code) {
            case 'KeyW':
                moveForward = true;
                break;
            case 'KeyA':
                moveLeft = true;
                break;
            case 'KeyS':
                moveBackward = true;
                break;
            case 'KeyD':
                moveRight = true;
                break;
            case 'Space':
                if (canJump === true) velocity.y += 35;
                canJump = false;
                break;
        }
    }
    const onKeyUp = function (event) {
        switch (event.code) {
            case 'KeyW':
                moveForward = false;
                break;
            case 'KeyA':
                moveLeft = false;
                break;
            case 'KeyS':
                moveBackward = false;
                break;
            case 'KeyD':
                moveRight = false;
                break;
        }
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 1);

    const PlaneGeometry = new THREE.PlaneGeometry(20, 50, 64, 64);
    const material2 = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(PlaneGeometry, material2);
    plane.rotateX(-1.57);
    scene.add(plane);
    objects.push(plane)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const geometry3 = new THREE.BoxGeometry(3, 3, 3);
    const material3 = new THREE.MeshLambertMaterial({ color: 0xff000f });
    const cube2 = new THREE.Mesh(geometry3, material3);
    cube2.position.x = 0
    cube2.position.y = 2
    cube2.position.z = -4
    scene.add(cube2);
    objects.push(cube2)


    const geometry4 = new THREE.BoxGeometry(3, 3, 3);
    const material4 = new THREE.MeshLambertMaterial({ color: 0xff00f0 });
    const cube4 = new THREE.Mesh(geometry4, material4);
    cube4.position.x = 4
    cube4.position.y = 2
    cube4.position.z = 11
    scene.add(cube4);
    objects.push(cube4)

    const geometry5 = new THREE.BoxGeometry(3, 3, 3);
    const material5 = new THREE.MeshLambertMaterial({ color: 0xff0f00 });
    const cube5 = new THREE.Mesh(geometry5, material5);
    cube5.position.x = -4
    cube5.position.y = 2
    cube5.position.z = 6
    scene.add(cube5);
    objects.push(cube5)

    const geometry6 = new THREE.BoxGeometry(3, 3, 7);
    const material6 = new THREE.MeshLambertMaterial({ color: 0xff0ff0 });
    const cube6 = new THREE.Mesh(geometry6, material6);
    cube6.position.x = -4
    cube6.position.y = 2
    cube6.position.z = 21
    scene.add(cube6);
    objects.push(cube6)

    const geometry7 = new THREE.BoxGeometry(3, 3, 7);
    const material7 = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    const cube7 = new THREE.Mesh(geometry7, material7);
    cube7.position.x = -8
    cube7.position.y = 2
    cube7.position.z = -8
    scene.add(cube7);
    objects.push(cube7)

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();

    if (controls.isLocked === true) {
        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 1;

        const intersections = raycaster.intersectObjects(objects, false);
        const onObject = intersections.length > 0;
        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 10.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * 70.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 70.0 * delta;

        if (onObject === true) {
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
        }
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        controls.getObject().position.y += (velocity.y * delta);
        if (controls.getObject().position.y < -1) {
            velocity.y = 0;
            controls.getObject().position.set(0, 1, 0);
            canJump = true;
        }
    }
    prevTime = time;
    renderer.render(scene, camera);
}