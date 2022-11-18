import * as THREE from 'three';
import DynamicTexture from './util/DynamicTexture.js';

// import {AdaptiveToneMappingPass} from '../node_modules/three/examples/jsm/postprocessing/AdaptiveToneMappingPass.js';
// import {AfterimagePass} from '../node_modules/three/examples/jsm/postprocessing/AfterimagePass.js';
// import {BloomPass} from '../node_modules/three/examples/jsm/postprocessing/BloomPass.js';
// import {BokehPass} from '../node_modules/three/examples/jsm/postprocessing/BokehPass.js';
// import {ClearPass} from '../node_modules/three/examples/jsm/postprocessing/ClearPass.js';
// import {CubeTexturePass} from '../node_modules/three/examples/jsm/postprocessing/CubeTexturePass.js';
// import {DotScreenPass} from '../node_modules/three/examples/jsm/postprocessing/DotScreenPass.js';
// import {EffectComposer} from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
// import {FilmPass} from '../node_modules/three/examples/jsm/postprocessing/FilmPass.js';
// import {GlitchPass} from '../node_modules/three/examples/jsm/postprocessing/GlitchPass.js';
// import {HalftonePass} from '../node_modules/three/examples/jsm/postprocessing/HalftonePass.js';
// import {LUTPass} from '../node_modules/three/examples/jsm/postprocessing/LUTPass.js';
// import {MaskPass} from '../node_modules/three/examples/jsm/postprocessing/MaskPass.js';
// import {OutlinePass} from '../node_modules/three/examples/jsm/postprocessing/OutlinePass.js';
// import {Pass} from '../node_modules/three/examples/jsm/postprocessing/Pass.js';
// import {RenderPass} from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
// import {SAOPass} from '../node_modules/three/examples/jsm/postprocessing/SAOPass.js';
// import {SavePass} from '../node_modules/three/examples/jsm/postprocessing/SavePass.js';
// import {ShaderPass} from '../node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
// import {SMAAPass} from '../node_modules/three/examples/jsm/postprocessing/SMAAPass.js';
// import {SSAARenderPass} from '../node_modules/three/examples/jsm/postprocessing/SSAARenderPass.js';
// import {SSAOPass} from '../node_modules/three/examples/jsm/postprocessing/SSAOPass.js';
// import {SSRPass} from '../node_modules/three/examples/jsm/postprocessing/SSRPass.js';
// import {TAARenderPass} from '../node_modules/three/examples/jsm/postprocessing/TAARenderPass.js';
// import {TexturePass} from '../node_modules/three/examples/jsm/postprocessing/TexturePass.js';
// import {UnrealBloomPass} from '../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';

// import {ACESFilmicToneMappingShader} from '../node_modules/three/examples/jsm/shaders/ACESFilmicToneMappingShader.js';
// import {AfterimageShader} from '../node_modules/three/examples/jsm/shaders/AfterimageShader.js';
// import {BasicShader} from '../node_modules/three/examples/jsm/shaders/BasicShader.js';
// import {BleachBypassShader} from '../node_modules/three/examples/jsm/shaders/BleachBypassShader.js';
// import {BlendShader} from '../node_modules/three/examples/jsm/shaders/BlendShader.js';
// import {BokehShader} from '../node_modules/three/examples/jsm/shaders/BokehShader.js';
// import {BokehShader, BokehDepthShader } from '../node_modules/three/examples/jsm/shaders/BokehShader2.js';
// import {BrightnessContrastShader} from '../node_modules/three/examples/jsm/shaders/BrightnessContrastShader.js';
// import {ColorCorrectionShader} from '../node_modules/three/examples/jsm/shaders/ColorCorrectionShader.js';
// import {ColorifyShader} from '../node_modules/three/examples/jsm/shaders/ColorifyShader.js';
// import {ConvolutionShader} from '../node_modules/three/examples/jsm/shaders/ConvolutionShader.js';
// import {CopyShader} from '../node_modules/three/examples/jsm/shaders/CopyShader.js';
// import {DepthLimitedBlurShader} from '../node_modules/three/examples/jsm/shaders/DepthLimitedBlurShader.js';
// import {DigitalGlitch} from '../node_modules/three/examples/jsm/shaders/DigitalGlitch.js';
// import {DOFMipMapShader} from '../node_modules/three/examples/jsm/shaders/DOFMipMapShader.js';
// import {DotScreenShader} from '../node_modules/three/examples/jsm/shaders/DotScreenShader.js';
// import {FilmShader} from '../node_modules/three/examples/jsm/shaders/FilmShader.js';
// import {FocusShader} from '../node_modules/three/examples/jsm/shaders/FocusShader.js';
// import {FreiChenShader} from '../node_modules/three/examples/jsm/shaders/FreiChenShader.js';
// import {FXAAShader} from '../node_modules/three/examples/jsm/shaders/FXAAShader.js';
// import {GammaCorrectionShader} from '../node_modules/three/examples/jsm/shaders/GammaCorrectionShader.js';
// import {GodRaysShader} from '../node_modules/three/examples/jsm/shaders/GodRaysShader.js';
// import {HalftoneShader} from '../node_modules/three/examples/jsm/shaders/HalftoneShader.js';
// import {HorizontalBlurShader} from '../node_modules/three/examples/jsm/shaders/HorizontalBlurShader.js';
// import {HorizontalTiltShiftShader} from '../node_modules/three/examples/jsm/shaders/HorizontalTiltShiftShader.js';
// import {HueSaturationShader} from '../node_modules/three/examples/jsm/shaders/HueSaturationShader.js';
// import {KaleidoShader} from '../node_modules/three/examples/jsm/shaders/KaleidoShader.js';
// import {LuminosityHighPassShader} from '../node_modules/three/examples/jsm/shaders/LuminosityHighPassShader.js';
// import {LuminosityShader} from '../node_modules/three/examples/jsm/shaders/LuminosityShader.js';
// import {MirrorShader} from '../node_modules/three/examples/jsm/shaders/MirrorShader.js';
// import {MMDToonShader} from '../node_modules/three/examples/jsm/shaders/MMDToonShader.js';
// import {NormalMapShader} from '../node_modules/three/examples/jsm/shaders/NormalMapShader.js';
// import {PixelShader} from '../node_modules/three/examples/jsm/shaders/PixelShader.js';
// import {RGBShiftShader} from '../node_modules/three/examples/jsm/shaders/RGBShiftShader.js';
// import {SAOShader} from '../node_modules/three/examples/jsm/shaders/SAOShader.js';
// import {SepiaShader} from '../node_modules/three/examples/jsm/shaders/SepiaShader.js';
// import {SMAAShader} from '../node_modules/three/examples/jsm/shaders/SMAAShader.js';
// import {SobelOperatorShader} from '../node_modules/three/examples/jsm/shaders/SobelOperatorShader.js';
// import {SSAOShader} from '../node_modules/three/examples/jsm/shaders/SSAOShader.js';
// import {SSRShader} from '../node_modules/three/examples/jsm/shaders/SSRShader.js';
// import {SubsurfaceScatteringShader} from '../node_modules/three/examples/jsm/shaders/SubsurfaceScatteringShader.js';
// import {TechnicolorShader} from '../node_modules/three/examples/jsm/shaders/TechnicolorShader.js';
// import {ToneMapShader} from '../node_modules/three/examples/jsm/shaders/ToneMapShader.js';
// import {ToonShader} from '../node_modules/three/examples/jsm/shaders/ToonShader.js';
// import {TriangleBlurShader} from '../node_modules/three/examples/jsm/shaders/TriangleBlurShader.js';
// import {UnpackDepthRGBAShader} from '../node_modules/three/examples/jsm/shaders/UnpackDepthRGBAShader.js';
// import {VerticalBlurShader} from '../node_modules/three/examples/jsm/shaders/VerticalBlurShader.js';
// import {VerticalTiltShiftShader} from '../node_modules/three/examples/jsm/shaders/VerticalTiltShiftShader.js';
// import {VignetteShader} from '../node_modules/three/examples/jsm/shaders/VignetteShader.js';
// import {VolumeShader} from '../node_modules/three/examples/jsm/shaders/VolumeShader.js';
// import {WaterRefractionShader} from '../node_modules/three/examples/jsm/shaders/WaterRefractionShader.js';

// import {SimplexNoise} from '../node_modules/three/examples/jsm/math/SimplexNoise.js';


class Render {
	renderer;
	composer;

	scene;
	camera;

	uiScene;
	uiCamera;
	uiTexture;

	constructor(width, height) {
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(width, height);
		this.renderer.autoClear = false;
		this.renderer.shadowMap.enabled = true;
		document.body.appendChild(this.canvas);

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 2000);

		this.uiScene = new THREE.Scene();
		this.uiCamera = new THREE.OrthographicCamera(-.5, .5, .5, -.5, 0, 1);
		this.uiTexture = new DynamicTexture(width, height);
		this.uiScene.add(new THREE.Mesh(new THREE.PlaneGeometry(), this.uiTexture.uiMaterial));

		// this.composer = new EffectComposer(this.renderer);
		//
		// // render pass
		// const renderPass = new THREE.RenderPass(scene, camera);
		//
		// const renderTargetParameters = {
		// 	minFilter: THREE.LinearFilter,
		// 	magFilter: THREE.LinearFilter,
		// 	stencilBuffer: false,
		// };
		//
		// // save pass
		// const savePass = new THREE.SavePass(
		// 	new THREE.WebGLRenderTarget(
		// 		container.clientWidth,
		// 		container.clientHeight,
		// 		renderTargetParameters,
		// 	),
		// );
		//
		// // blend pass
		// const blendPass = new THREE.ShaderPass(THREE.BlendShader, "tDiffuse1");
		// blendPass.uniforms["tDiffuse2"].value = savePass.renderTarget.texture;
		// blendPass.uniforms["mixRatio"].value = 0.8;
		//
		// // output pass
		// const outputPass = new THREE.ShaderPass(THREE.CopyShader);
		// outputPass.renderToScreen = true;
		//
		// // adding passes to composer
		// composer.addPass(renderPass);
		// composer.addPass(blendPass);
		// composer.addPass(savePass);
		// composer.addPass(outputPass);


		// let renderPass = new RenderPass(this.scene, this.camera);
		// this.composer.addPass( renderPass );
		// let glitchPass = new UnrealBloomPass();
		// this.composer.addPass( glitchPass );
	}

	get canvas() {
		return this.renderer.domElement;
	}

	render(uiOnly) {
		this.renderer.clear();
		if (!uiOnly)
			this.renderer.render(this.scene, this.camera);
		// this.composer.render();

		this.renderer.render(this.uiScene, this.uiCamera);
		this.uiTexture.ctx.clearRect(0, 0, this.uiTexture.width, this.uiTexture.height);
	}
}

export default Render;
