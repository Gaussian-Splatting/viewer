// from https://github.com/d0rianb/UnrailEngine/blob/master/src/core/geometry.ts
export function setCanvasDimensions(canvas: HTMLCanvasElement, width: number, height: number, pixelRatio?: number): void {
    canvas.width = width * (pixelRatio || window.devicePixelRatio || 1)
    canvas.height = height * (pixelRatio || window.devicePixelRatio || 1)
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
}

// Return the filename from a given path
// ex : ./test/models/main.splat -> main.splat
export function getFilenameFromPath(path: string): string {
    const splitResult = path.split('/')
    return splitResult[splitResult.length - 1]
}
