import * as THREE from 'three';

class TrapezoidParams {
	backLeft;
	deltaX;
	deltaZ;

	constructor(backLeft, deltaX, deltaZ) {
		this.backLeft = backLeft;
		this.deltaX = [-deltaX, 0, 0];
		this.deltaZ = [0, 0, deltaZ];
	}


	get x() {
		return sum(this.backLeft, this.deltaX);
	}

	get z() {
		return sum(this.backLeft, this.deltaZ);
	}

	get xz() {
		return sum(this.backLeft, this.deltaX, this.deltaZ);
	}
}

const sum = (...vs) =>
	vs[0].map((_, i) => vs.map(v => v[i]).reduce((a, b) => a + b, 0));

const rect = (p1, p2, p3, p4) => [p1, p2, p3, p1, p3, p4].flat();

const trapezoid = (...trapezoidParams) => {
	let rects = [];
	trapezoidParams.forEach((param, i) => {
		rects.push(rect(param.backLeft, param.x, param.xz, param.z));
		if (i) {
			let prevParam = trapezoidParams[i - 1];
			rects.push(rect(prevParam.backLeft, prevParam.x, param.x, param.backLeft)); // back
			rects.push(rect(prevParam.backLeft, param.backLeft, param.z, prevParam.z)); // left
			rects.push(rect(prevParam.x, prevParam.xz, param.xz, param.x)); // right
			rects.push(rect(prevParam.xz, prevParam.z, param.z, param.xz)); // front
		}
	});
	return rects.flat();
};

const cube = (b1, w, h, l) =>
	trapezoid(new TrapezoidParams(b1, w, l), new TrapezoidParams(sum(b1, [0, h, 0]), w, l));

const meshFromVectors = (vertices, material) => {
	vertices = new Float32Array(vertices);
	let geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
	geometry.computeVertexNormals();
	return new THREE.Mesh(geometry, material);
};

export {
	TrapezoidParams,
	trapezoid,
	cube,
	meshFromVectors,
};
