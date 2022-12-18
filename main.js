import './style.css'
import * as THREE from 'three';
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import { LoadingBar} from './Utils/LoadingBar';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class App{
  constructor(){
    const container = document.createElement( 'div' );
    document.body.appendChild( container );

    this.clock = new THREE.Clock();
    
    this.camera = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,20);

    this.scene =  new THREE.Scene();
    this.scene.background = new THREE.Color(0xcccccc);

    const ambient =  new THREE.HemisphereLight(0xffffff,0xbbbbff,0.3);
    this.scene.add(ambient);

    const light = new THREE.DirectionalLight();
    light.position.set(0.2,1,1);
    this.scene.add(light);
    
    this.renderer = new THREE.WebGLRenderer({
      antialias:true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth,window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    
    container.appendChild(this.renderer.domElement);
    
    //
    this.initScene();
    this.setupXR();

    const controls = new OrbitControls(this.camera,this.renderer.domElement);
    this.controls.target.set(0,3.5,0);
    this.controls.update();

    window.addEventListener('resize',this.resize.bind(this));

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

 
  initScene(){

    this.geometry = new THREE.BoxGeometry(0.6,0.6,0.6);
    this.meshes = [];
  }

  setupXR(){
    this.renderer.xr.enabled = true;

    const self = this;
    let controller;

    function onSelect(){

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

  loadGLTF(){
    const self = this;

    const loader = new GLTFLoader().setPath('../../assets/');

    loader.load(
      'office-chair.glb',
      function(gltf){
        self.chair = gltf.scene;
        self.scene.add(gltf.scene);
        self.LoadingBar.visible = false;
        self.renderer.setAnimationLoop(self.render.bind(self));
      },
      function(xhr){
        self.LoadingBar.progress = xhr.loaded/xhr.total;
      },
      function(err){
        console.log('An error happened');
      }
    )
  }
  
  loadFBX(){
    const self = this;

    const loader = new FBXLoader().setPath('../../assets/');

    loader.load(
      'office-chair.fbx',
      function(object){
        self.chair = object;
        self.scene.add(object);
        self.LoadingBar.visible = false;
        self.renderer.setAnimationLoop(self.render.bind(self));
      },
      function(xhr){
        self.LoadingBar.progress = xhr.loaded/xhr.total;
      },
      function(err){
        console.log('An error happened');
      }
    )
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