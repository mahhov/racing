import * as THREE from 'three';
import GameEntity from '../GameEntity.js';
import DynamicTexture from '../util/DynamicTexture.js';
import {meshFromVectors, rect} from '../util/GeometryCreator.js';
import {radian, randInt, UP} from '../util/util.js';

class Track extends GameEntity {
	segments;
	startPosition;
	texture;

	constructor(width, height, length, segments, startPosition) {
		super(Track.createMesh(width, height, length, segments));
		this.texture = Track.createTexture(width, length, segments);
		this.segments = segments;
		this.startPosition = startPosition;
	}

	static createTexture(width, length, segments) {
		let texture = Track.createTextureCheck(width, length);

		texture.ctx.fillStyle = '#00f';
		segments.forEach((segment, i) => {
			texture.ctx.fillStyle = `rgb(0,0,${155 + Math.floor(100 * i / segments.length)})`;
			texture.ctx.beginPath();
			texture.ctx.moveTo(segment.left1.x, segment.left1.z);
			texture.ctx.lineTo(segment.right1.x, segment.right1.z);
			texture.ctx.lineTo(segment.right2.x, segment.right2.z);
			texture.ctx.lineTo(segment.left2.x, segment.left2.z);
			texture.ctx.fill();
		});
		texture.ctx.strokeStyle = '#fff';
		segments.forEach(segment => {
			texture.ctx.beginPath();
			texture.ctx.moveTo(segment.left1.x, segment.left1.z);
			texture.ctx.lineTo(segment.left2.x, segment.left2.z);
			texture.ctx.moveTo(segment.right1.x, segment.right1.z);
			texture.ctx.lineTo(segment.right2.x, segment.right2.z);
			texture.ctx.stroke();
		});

		return texture;
	}

	static createMesh(width, height, length, segments) {
		let group = new THREE.Group();
		segments.forEach((segment, i) => {
			let material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, color: 155 + Math.floor(100 * i / segments.length)});
			let segmentMesh = meshFromVectors(rect(segment.left1.toArray(), segment.right1.toArray(), segment.right2.toArray(), segment.left2.toArray()), material);
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
