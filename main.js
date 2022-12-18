import './style.css'
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class App{
  constructor(){
    const container = document.createElement( 'div' );
    document.body.appendChild( container );

    this.camera = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,20);

    this.scene =  new THREE.Scene();

    this.scene.add(new THREE.HemisphereLight(0x606060,0x404040));

    const light = new THREE.DirectionalLight();
    light.position.set(1,1,1).normalize();
    this.scene.add(light);
    
    this.renderer = new THREE.WebGLRenderer({
      antialias:true,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth,window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    
    container.appendChild(this.renderer.domElement);
    
    this.initScene();
    this.setupXR();

    this.controls = new OrbitControls(this.camera,this.renderer.domElement);
    this.controls.target.set(0,3.5,0);
    this.controls.update();

    window.addEventListener('resize',this.resize.bind(this));

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  initScene(){

    this.geometry = new THREE.BoxGeometry(0.06,0.06,0.06);
    this.meshes = [];
  }

  setupXR(){
    this.renderer.xr.enabled = true;

    const self = this;
    let controller;

    function onSelect(){
      console.log("Clicked");
    }

    const btn = new ARButton(this.render);
    controller = this.renderer.xr.getController(0);
    controller.addEventListener('select',onSelect);
    this.scene.add(controller);

    document.body.appendChild(
      ARButton.createButton(this.renderer)
    );

    this.renderer.setAnimationLoop(this.render.bind(this));

  }

  resize(){
    this.camera.aspect = window.innerWidth/window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth,window.innerHeight);
  }

  render(){
    this.meshes.forEach((mesh) => {mesh.rotateY(0.01);});
    this.renderer.render(this.scene,this.camera);
  }
}

export {App};