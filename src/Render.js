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

	skyScene;
	skyCamera;
	skyTexture;

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

		this.skyScene = new THREE.Scene();
		this.skyCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 25);
		this.skyTexture = new DynamicTexture(400, 400);
		this.skyScene.add(new THREE.Mesh(new THREE.SphereGeometry(10, 30, 15), this.skyTexture.skyMaterial));
	}

	get canvas() {
		return this.renderer.domElement;
	}

	render(uiOnly) {
		this.renderer.clear();
		if (!uiOnly) {
			this.skyCamera.lookAt(this.camera.getWorldDirection(new THREE.Vector3()));
			this.renderer.render(this.skyScene, this.skyCamera);
			this.renderer.render(this.scene, this.camera);
		}
		this.renderer.render(this.uiScene, this.uiCamera);
		this.uiTexture.ctx.clearRect(0, 0, this.width, this.height);
	}
}

export default Render;
