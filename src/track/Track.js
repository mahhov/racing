import * as THREE from 'three';
import GameEntity from '../GameEntity.js';
import DynamicTexture from '../util/DynamicTexture.js';
import {meshFromVectors, rect} from '../util/GeometryCreator.js';
import {randInt} from '../util/util.js';

class Track extends GameEntity {
	segments;
	size;
	startPosition;
	startDirection;
	texture;

	constructor(segments, size) {
		super(Track.createMesh(...size.toArray(), segments));
		this.segments = segments;
		this.size = size;
		this.startPosition = segments[0].left1.clone().add(segments[0].bottom.multiplyScalar(.5)).add(segments[0].left.setLength(50));
		this.startDirection = segments[0].left.clone().normalize();
		this.texture = Track.createTexture(size.x, size.z, segments);
	}

	static createTexture(width, length, segments) {
		let max = Math.max(width, length);
		let shiftX = (max - width) / 2;
		let shiftY = (max - length) / 2;

		let texture = Track.createTextureCheck(max, max);

		texture.ctx.fillStyle = '#00f';
		segments.forEach((segment, i) => {
			texture.ctx.fillStyle = `rgb(0,0,${155 + Math.floor(100 * i / segments.length)})`;
			texture.ctx.beginPath();
			texture.ctx.moveTo(segment.left1.x + shiftX, segment.left1.z + shiftY);
			texture.ctx.lineTo(segment.right1.x + shiftX, segment.right1.z + shiftY);
			texture.ctx.lineTo(segment.right2.x + shiftX, segment.right2.z + shiftY);
			texture.ctx.lineTo(segment.left2.x + shiftX, segment.left2.z + shiftY);
			texture.ctx.fill();
		});
		texture.ctx.lineWidth = 5;
		texture.ctx.strokeStyle = '#fff';
		segments.forEach(segment => {
			texture.ctx.beginPath();
			texture.ctx.moveTo(segment.left1.x + shiftX, segment.left1.z + shiftY);
			texture.ctx.lineTo(segment.left2.x + shiftX, segment.left2.z + shiftY);
			texture.ctx.moveTo(segment.right1.x + shiftX, segment.right1.z + shiftY);
			texture.ctx.lineTo(segment.right2.x + shiftX, segment.right2.z + shiftY);
			texture.ctx.stroke();
		});

		return texture;
	}

	static createMesh(width, height, length, segments) {
		let group = new THREE.Group();

		segments.forEach((segment, i) => {
			let texture = new DynamicTexture(100, 100);
			texture.ctx.fillStyle = `rgb(${randInt(170)}, ${randInt(170)}, ${randInt(170)})`;
			texture.ctx.fillRect(0, 0, 100, 100);
			texture.ctx.strokeStyle = 'white';
			texture.ctx.beginPath();
			texture.ctx.moveTo(5, 5);
			texture.ctx.lineTo(5, 95);
			texture.ctx.moveTo(95, 5);
			texture.ctx.lineTo(95, 95);
			texture.ctx.stroke();
			let material = texture.phongMaterial;

			let segmentMesh = meshFromVectors(
				rect(segment.left1.toArray(), segment.right1.toArray(), segment.right2.toArray(), segment.left2.toArray()),
				material,
				rect([0, 0], [1, 0], [1, 1], [0, 1]),
			);
			segmentMesh.receiveShadow = true;
			group.add(segmentMesh);
		});

		let skyTexture = new DynamicTexture(400, 400);
		const MAX_SIZE = 40;
		for (let i = 0; i < 200; i++) {
			skyTexture.ctx.strokeStyle = `rgb(${randInt(256)}, ${randInt(256)}, ${randInt(256)})`;
			skyTexture.ctx.strokeRect(randInt(skyTexture.width - MAX_SIZE), randInt(skyTexture.height - MAX_SIZE), randInt(MAX_SIZE), randInt(MAX_SIZE));
		}
		let skyBox = new THREE.Mesh(new THREE.BoxGeometry(width, height, length), skyTexture.skyMaterial);
		skyBox.position.set(width / 2, -80, length / 2);
		group.add(skyBox);

		return group;
	}

	static createTextureCheck(width, length) {
		let SQUARE_SIZE = 30;
		let texture = new DynamicTexture(width, length);
		texture.ctx.fillStyle = '#f00';
		for (let x = 0; x < width / SQUARE_SIZE; x++)
			for (let y = 0; y < length / SQUARE_SIZE; y++)
				if ((x + y) % 2)
					texture.ctx.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
		return texture;
	}
}

export default Track;
