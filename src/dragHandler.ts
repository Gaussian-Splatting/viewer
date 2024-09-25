type HandlerCallback = (file: File | string) => any

// For the splashscreen
const BACKGROUND_COLOR = '#b0b0b0'
const BACKGROUND_HOVER_COLOR = '#c0c0c0'



export class DragHandler {
    static readonly supportedExtensions = ['ply', 'splat', 'ksplat'];
    static icon = new Image()

    static initEvents(canvas: HTMLCanvasElement, callback: HandlerCallback) {
        window.addEventListener('drop', e => this.handleFileDrop(e, callback))
        window.addEventListener('dragover', e => this.handleDragOver(e, canvas))
        window.addEventListener('dragleave', _ => this.clearDropZone(canvas))

        this.icon.src = 'resources/icons/drag-and-drop.png'
    }

    static getFile(e: DragEvent): File | null {
        if (e.dataTransfer?.items) {
            for (let item of [...e.dataTransfer.items]) {
                if (item.kind === "file") {
                    return item.getAsFile()
                }
            }
        }
        if (e.dataTransfer?.files) {
            // Use DataTransfer interface to access the file(s)
            for (let file of [...e.dataTransfer.files]) {
                return file
            }
        }
        return null
    }

    static handleDragOver(e: DragEvent, canvas: HTMLCanvasElement) {
        e.preventDefault()
        this.drawDropZone(canvas)
    }

    static handleFileDrop(e: DragEvent, callback: HandlerCallback) {
        e.preventDefault()
        const file = this.getFile(e)
        if (file) {
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            if (fileExtension && this.supportedExtensions.includes(fileExtension)) {
                callback(file)
            } else {
                console.error('Invalid file type')  // TODO: proper UI
            }
        }
    }

    static drawDropZone(canvas: HTMLCanvasElement) {
        let ctx = canvas.getContext('2d')!
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = BACKGROUND_HOVER_COLOR
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const icon_size = 256
        ctx.drawImage(this.icon, (canvas.width - icon_size) / 2, (canvas.height - icon_size) / 2, icon_size, icon_size)
    }

    static clearDropZone(canvas: HTMLCanvasElement) {
        this.drawSplashScreen(canvas)
    }

    static drawSplashScreen(canvas: HTMLCanvasElement) {
        let ctx = canvas.getContext('2d')!
        // Background
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = BACKGROUND_COLOR
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Text
        ctx.textAlign = 'center'
        ctx.font = "48px sans-serif"
        ctx.fillStyle = '#f0f0f0'
        ctx.fillText('SightInc Viewer', canvas.width / 2, canvas.height / 2)
    }
}
