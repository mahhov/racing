import * as THREE from 'three';

const sum = (...vs) =>
	vs[0].map((_, i) => vs.map(v => v[i]).reduce((a, b) => a + b, 0));

const rect = (p1, p2, p3, p4) => [p1, p2, p3, p1, p3, p4].flat();

const trapezoid = (b1, bdx, bdz, t1, tdx, tdz) => {
	bdx = [bdx, 0, 0];
	bdz = [0, 0, bdz];
	tdx = [tdx, 0, 0];
	tdz = [0, 0, tdz];

	let bx = sum(b1, bdx);
	let bz = sum(b1, bdz);
	let bxz = sum(b1, bdx, bdz);

	let tx = sum(t1, tdx);
	let tz = sum(t1, tdz);
	let txz = sum(t1, tdx, tdz);

	return [
		...rect(b1, bx, bxz, bz), // bottom
		...rect(t1, tx, txz, tz), // top
		...rect(b1, bx, tx, t1), // back
		...rect(b1, t1, tz, bz), // left
		...rect(bx, bxz, txz, tx), // right
		...rect(bxz, bz, tz, txz), // front
	];
};

const cube = (b1, w, h, l) =>
	trapezoid(b1, w, l, sum(b1, [0, h, 0]), w, l);

const meshFromVectors = (vertices, material) => {
	vertices = new Float32Array(vertices);
	let geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
	geometry.scale(-1, 1, 1);
	geometry.computeVertexNormals();
	return new THREE.Mesh(geometry, material);
};

export {trapezoid, cube, meshFromVectors};
