import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import * as THREE from 'three';


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

// Handle drag-and-drop
window.addEventListener('drop', e => {
  console.log('drop', e)
  e.preventDefault()

  if (e.dataTransfer.items) {
    [...e.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file = item.getAsFile();
        main(file)
      }
    });
  } else {
    // Use DataTransfer interface to access the file(s)
    [...e.dataTransfer.files].forEach((file, i) => {
      main(file)
    });
  }

})

window.addEventListener('load', e => main())

async function main(file: File | null) {
  const path = "./resources/BAM-1K-10K-2200p_60ksteps.ply"
  viewer.addSplatScene(path, {
    progressiveLoad: false, // Huge performance improvement
    format: GaussianSplats3D.SceneFormat.Ply
  }).then(() => { viewer.start(); });
};


