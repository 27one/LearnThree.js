import * as THREE from 'three';
import dat from "https://cdn.skypack.dev/dat.gui";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls";

'use strict';

/* global THREE, dat */

function main() {
  const canvas = document.querySelector('#c');
  const view1Elem = document.querySelector('#view1');
  const view2Elem = document.querySelector('#view2');
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 5;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 30, 20);

  const cameraHelper = new THREE.CameraHelper(camera);

  class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
      this.obj = obj;
      this.minProp = minProp;
      this.maxProp = maxProp;
      this.minDif = minDif;
    }
    get min() {
      return this.obj[this.minProp];
    }
    set min(v) {
      this.obj[this.minProp] = v;
      this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }
    get max() {
      return this.obj[this.maxProp];
    }
    set max(v) {
      this.obj[this.maxProp] = v;
      this.min = this.min;  // this will call the min setter
    }
  }

  const gui = new dat.GUI();
  gui.add(camera, 'fov', 1, 180);
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
  gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near');
  gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far');

  const controls = new OrbitControls(camera, view1Elem);
  controls.target.set(0, 5, 0);
  controls.update();

  const camera2 = new THREE.PerspectiveCamera(
    60,  // fov
    2,   // aspect
    0.1, // near
    500, // far
  );
  camera2.position.set(40, 10, 30);
  camera2.lookAt(0, 5, 0);

  const controls2 = new OrbitControls(camera2, view2Elem);
  controls2.target.set(0, 0, 0);
  controls2.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');
  scene.add(cameraHelper);

  {
    const planeSize = 60;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://r105.threejsfundamentals.org/threejs/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });

  
    const wallHeight = 30;
    const wallWidth = 60;

    const loaderWall = new THREE.TextureLoader();
    const textureWall = loader.load('https://r105.threejsfundamentals.org/threejs/resources/images/checker.png');
    textureWall.wrapS = THREE.RepeatWrapping;
    textureWall.wrapT = THREE.RepeatWrapping;
    textureWall.magFilter = THREE.NearestFilter;
    const repeatsHeight = wallHeight / 2;
    const repeatsWidth = wallWidth / 2;
    textureWall.repeat.set(repeatsWidth, repeatsHeight);

    const wallGeo = new THREE.PlaneGeometry(wallWidth, wallHeight);
    const wallMat = new THREE.MeshPhongMaterial({
    map: textureWall,
    side: THREE.DoubleSide,
  });


    const mesh1 = new THREE.Mesh(planeGeo, planeMat);
    mesh1.rotation.x = Math.PI * -.5;
    scene.add(mesh1);

    const mesh2 = new THREE.Mesh(wallGeo, wallMat);
    mesh2.position.set(0, planeSize/4, -planeSize/2)
    scene.add(mesh2)

    const mesh3 = new THREE.Mesh(wallGeo, wallMat);
    mesh3.rotation.y = Math.PI * .5;
    mesh3.position.set(-planeSize/2, planeSize/4, 0)
    scene.add(mesh3)

    const mesh4 = new THREE.Mesh(wallGeo, wallMat);
    mesh4.rotation.y = Math.PI * -.5;
    mesh4.position.set(planeSize/2, planeSize/4, 0)
    scene.add(mesh4)
  }

  
  {
    const cubeSize = 4;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
    const mesh = new THREE.Mesh(cubeGeo, cubeMat);
    mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
    scene.add(mesh);
  }
  {
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(mesh);
  }

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light1 = new THREE.DirectionalLight(color, intensity);
    light1.position.set(0, 10, 0);
    light1.target.position.set(-5, 0, 0);
    scene.add(light1);
    scene.add(light1.target);
  }

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light2 = new THREE.DirectionalLight(color, intensity);
    light2.position.set(0, -10, 0);
    light2.target.position.set(5, 0, 0);
    scene.add(light2);
    scene.add(light2.target);
  }

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light2 = new THREE.DirectionalLight(color, intensity);
    light2.position.set(0, 0, 10);
    light2.target.position.set(5, 0, 0);
    scene.add(light2);
    scene.add(light2.target);
  }


  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function setScissorForElement(elem) {
    const canvasRect = canvas.getBoundingClientRect();
    const elemRect = elem.getBoundingClientRect();

    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
    const left = Math.max(0, elemRect.left - canvasRect.left);
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
    const top = Math.max(0, elemRect.top - canvasRect.top);

    const width = Math.min(canvasRect.width, right - left);
    const height = Math.min(canvasRect.height, bottom - top);

    const positiveYUpBottom = canvasRect.height - bottom;
    renderer.setScissor(left, positiveYUpBottom, width, height);
    renderer.setViewport(left, positiveYUpBottom, width, height);

    return width / height;
  }

  function render() {

    resizeRendererToDisplaySize(renderer);

    renderer.setScissorTest(true);

    {
      const aspect = setScissorForElement(view1Elem);

      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      cameraHelper.update();

      cameraHelper.visible = false;

      scene.background.set(0x000000);

      renderer.render(scene, camera);
    }

    {
      const aspect = setScissorForElement(view2Elem);

      camera2.aspect = aspect;
      camera2.updateProjectionMatrix();

      cameraHelper.visible = true;

      scene.background.set(0x000040);

      renderer.render(scene, camera2);
    }

    requestAnimationFrame(render);
  }

  render();
}

main();
