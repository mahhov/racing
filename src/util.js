import * as THREE from 'three';

const UP = new THREE.Vector3(0, 1, 0);

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const rand = max => Math.random() * max;
const radian = degree => degree / 180 * Math.PI;

export {
	UP,
	clamp,
	rand,
	radian,
};
