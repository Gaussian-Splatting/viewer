import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import * as THREE from 'three';

import { DragHandler } from './dragHandler'
import { setCanvasDimensions } from './utils';
import CameraControls from 'camera-controls';

CameraControls.install({ THREE: THREE })

// Load a default scene and prevent drag and drop
// This flag should only be use directly during the development of the viewer
const DEBUG = true
const CAMERA_CUSTOM_ORBIT_POINT = false // not working

const canvas = document.querySelector('canvas')!
setCanvasDimensions(canvas, window.innerWidth, window.innerHeight - 3.5 * 16) // header size = 3.5em

window.addEventListener('load', _ => {
  let sightInViewer = new SightInViewer();
  (window as any).viewer = sightInViewer
})


class SightInViewer {
  viewer: GaussianSplats3D.Viewer

  constructor() {
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      precision: 'highp',
      canvas
    });

    const dpr = window.devicePixelRatio
    renderer.setSize(canvas.width / dpr, canvas.height / dpr)
    renderer.setPixelRatio(dpr)
    renderer.setClearColor(new THREE.Color(0xeeeeee), 1.0)
    // TODO :  handle resize 
    window.addEventListener('resize', () => {
      const dpr = window.devicePixelRatio
      this.viewer.renderer.setSize(canvas.width / dpr, canvas.height / dpr)
      this.viewer.forceRenderNextFrame()
    })

    this.viewer = new GaussianSplats3D.Viewer({
      cameraUp: [0.0, -1.0, 0.0],
      initialCameraPosition: [-8.09653, -6.53072, -7.72696],
      initialCameraLookAt: [0, 1.95338, 1.51278],
      sphericalHarmonicsDegree: 0,
      gpuAcceleratedSort: true,
      halfPrecisionCovariancesOnGPU: true,
      dynamicScene: false,
      splatRenderMode: GaussianSplats3D.RenderMode.ThreeD,
      useBuiltInControls: !CAMERA_CUSTOM_ORBIT_POINT,
      renderer
    })

    if (CAMERA_CUSTOM_ORBIT_POINT) {
      this.viewer.controls = new CameraControls(this.viewer.camera, this.viewer.renderer.domElement)
    } else {
      this.viewer.controls.enableDamping = false
    }


    if (CAMERA_CUSTOM_ORBIT_POINT) {
      // Change the controls to orbit around the mouse instead of the center point
      this.viewer.onMouseDown = () => {
        // Original implementation
        this.viewer.mouseDownPosition.copy(this.viewer.mousePosition);
        this.viewer.mouseDownTime = performance.now() / 1000;
        // Raycast the mouse position to rotate the mouse
        const renderDimensions = new THREE.Vector2();
        let outHits = [];
        this.viewer.getRenderDimensions(renderDimensions);
        this.viewer.raycaster.setFromCameraAndScreenPosition(this.viewer.camera, this.viewer.mousePosition, renderDimensions);
        this.viewer.raycaster.intersectSplatMesh(this.viewer.splatMesh, outHits);
        if (outHits.length > 0) {
          const hit = outHits[0];
          const intersectionPoint = hit.origin;
          console.log(intersectionPoint)
          this.viewer.controls.setTarget(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z)
          this.viewer.controls.setOrbitPoint(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z)
          // Update camera
          {
            const tempVector = new THREE.Vector3();
            const toLookAtDistance = 1 / (this.viewer.camera.zoom * 0.001);
            tempVector.copy(intersectionPoint).sub(this.viewer.camera.position).normalize().multiplyScalar(toLookAtDistance).negate();
            this.viewer.camera.position.copy(intersectionPoint).add(tempVector);
          }

          this.viewer.controls.update()
        } else {
          console.log('no hit')
        }
      }

      // hack to have native controls
      this.viewer.useBuiltInControls = true
      this.viewer.setupEventHandlers()
      this.viewer.useBuiltInControls = false

    }

    DragHandler.initEvents((file: File) => this.startViewerWithFile(file))
    if (DEBUG) {
      // Load the default scene
      this.startViewerWithFile("./models/BAM-1K-10K-2200p_60ksteps.ply")
    }
  }

  startViewerWithFile(file: File | string) {
    if (file instanceof File) {
      document.querySelector('#file-name')!.innerHTML = file.name
    }

    let viewerAddFunction = DEBUG ? this.viewer.addSplatScene : this.viewer.addSplatSceneFromFile
    viewerAddFunction = viewerAddFunction.bind(this.viewer)
    viewerAddFunction(file, {
      progressiveLoad: false, // Huge performance improvement
      format: GaussianSplats3D.SceneFormat.Ply,
      // onProgress: console.log

    }).then(() => { this.viewer.start() })
  }
}



