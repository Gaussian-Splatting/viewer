import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import * as THREE from 'three';

import { DragHandler } from './dragHandler'
import { setCanvasDimensions } from './utils';

// Load a default scene and prevent drag and drop
// This flag should only be use directly during the development of the viewer
const DEBUG = false

const canvas = document.querySelector('canvas')!

setCanvasDimensions(canvas, window.innerWidth, window.innerHeight)


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

    renderer.setSize(canvas.width, canvas.height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(new THREE.Color(0xeeeeee), 1.0)
    // TODO :  handle resize 

    this.viewer = new GaussianSplats3D.Viewer({
      cameraUp: [0.0, -1.0, 0.0],
      initialCameraPosition: [-8.09653, -6.53072, -7.72696],
      initialCameraLookAt: [0, 1.95338, 1.51278],
      sphericalHarmonicsDegree: 1,
      halfPrecisionCovariancesOnGPU: true,
      dynamicScene: false,
      splatRenderMode: GaussianSplats3D.RenderMode.ThreeD,
      renderer
    })

    this.viewer.controls.enableDamping = false

    DragHandler.initEvents(file => this.startViewerWithFile(file))
    if (DEBUG) {
      // Load the default scene
      this.startViewerWithFile("./resources/BAM-1K-10K-2200p_60ksteps.ply")
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
      onProgress: console.log

    }).then(() => { this.viewer.start() })
  }
}



