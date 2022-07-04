import * as THREE from 'three';

const UP = new THREE.Vector3(0, 1, 0);

let sleep = ms => new Promise(r => setTimeout(r, ms));

let clamp = (v, min, max) => Math.min(Math.max(v, min), max);
let rand = max => Math.random() * max;
let radian = degree => degree / 180 * Math.PI;

export {
	UP,
	sleep,
	clamp,
	rand,
	radian,
};
