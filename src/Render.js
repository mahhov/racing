import * as THREE from 'three';
import DynamicTexture from './util/DynamicTexture.js';

class Render {
	width;
	height;
	renderer;
	scene;
	camera;
	uiScene;
	uiCamera;
	uiTexture;

	constructor(width, height) {
		this.width = width;
		this.height = height;

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(width, height);
		this.renderer.autoClear = false;
		document.body.appendChild(this.canvas);

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

		this.uiScene = new THREE.Scene();
		this.uiCamera = new THREE.OrthographicCamera(-.5, .5, .5, -.5, 0, 1);
		this.uiTexture = new DynamicTexture(width, height);
		this.uiScene.add(new THREE.Mesh(new THREE.PlaneGeometry(), this.uiTexture.uiMaterial));
	}

	get canvas() {
		return this.renderer.domElement;
	}

	render(uiOnly) {
		this.renderer.clear();
		if (!uiOnly)
			this.renderer.render(this.scene, this.camera);
		this.renderer.render(this.uiScene, this.uiCamera);
		this.uiTexture.ctx.clearRect(0, 0, this.width, this.height);
	}
}

export default Render;
