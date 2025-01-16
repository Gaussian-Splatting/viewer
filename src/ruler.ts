import * as THREE from 'three'

const emptyVector = new THREE.Vector3()

const material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 1,
    linecap: 'round', //ignored by WebGLRenderer
    linejoin: 'round', //ignored by WebGLRenderer
})


class Ruler {
    start: THREE.Vector3
    end: THREE.Vector3
    measure: string

    constructor() {
        this.start = new THREE.Vector3()
        this.end = new THREE.Vector3()
        this.measure = ''
    }

    draw(scene: THREE.Scene) {
        if (this.start != emptyVector && this.end != emptyVector) {
            const geometry = new THREE.BufferGeometry().setFromPoints([this.start, this.end])
            const line = new THREE.Line(geometry, material)
            line.renderOrder = 3
        }
    }
}

export { Ruler }
