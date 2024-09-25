// from https://github.com/d0rianb/UnrailEngine/blob/master/src/core/geometry.ts
export function setCanvasDimensions(canvas: HTMLCanvasElement, width: number, height: number, pixelRatio?: number): void {
    canvas.width = width * (pixelRatio || window.devicePixelRatio || 1)
    canvas.height = height * (pixelRatio || window.devicePixelRatio || 1)
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
}
