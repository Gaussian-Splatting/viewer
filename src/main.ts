import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import * as THREE from 'three';

import { DragHandler } from './dragHandler'
import { setCanvasDimensions } from './utils';

// Load a default scene and prevent drag and drop
// This flag should only be use directly during the development of the viewer
const DEBUG = false

const viewer = new GaussianSplats3D.Viewer({
  cameraUp: [0.0, -1.0, 0.0],
  initialCameraPosition: [-8.09653, -6.53072, -7.72696],
  initialCameraLookAt: [0, 1.95338, 1.51278],
  sphericalHarmonicsDegree: 1,
  halfPrecisionCovariancesOnGPU: true,
  dynamicScene: false,
  splatRenderMode: GaussianSplats3D.RenderMode.ThreeD,
});

viewer.controls.enableDamping = false;

(window as any).viewer = viewer

const canvas = document.querySelector('canvas')!
setCanvasDimensions(canvas, window.innerWidth, window.innerHeight)

// Init events
DragHandler.initEvents(canvas, initViewerWithFile)

// Load the default scene
window.addEventListener('load', _ => {
  DragHandler.drawSplashScreen(canvas)
  if (DEBUG) {
    initViewerWithFile("./resources/BAM-1K-10K-2200p_60ksteps.ply")
  }
})


function initViewerWithFile(file: File | string) {
  let viewerAddFunction = DEBUG ? viewer.addSplatScene : viewer.addSplatSceneFromFile
  viewerAddFunction(file, {
    progressiveLoad: false, // Huge performance improvement
    format: GaussianSplats3D.SceneFormat.Ply,

  }).then(() => { viewer.start() })
}



