type HandlerCallback = (file: File) => any

export class DragHandler {
    static readonly supportedExtensions = ['ply', 'splat', 'ksplat'];
    static icon = new Image()

    static initEvents(callback: HandlerCallback) {
        window.addEventListener('drop', e => this.handleFileDrop(e, callback))
        window.addEventListener('dragover', e => this.handleDragOver(e))
        window.addEventListener('dragleave', _ => this.clearDropZone())

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

    static handleDragOver(e: DragEvent) {
        e.preventDefault()
        this.drawDropZone()
    }

    static handleFileDrop(e: DragEvent, callback: HandlerCallback) {
        e.preventDefault()
        const file = this.getFile(e)
        if (file) {
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            if (fileExtension && this.supportedExtensions.includes(fileExtension)) {
                this.clearDropZone()
                callback(file)
            } else {
                console.error('Invalid file type')  // TODO: proper UI
            }
        }
    }

    static drawDropZone() {
        let div: HTMLDivElement = document.querySelector('.drag-and-drop-overlay')!
        div.style.opacity = '1'
    }

    static clearDropZone() {
        let div: HTMLDivElement = document.querySelector('.drag-and-drop-overlay')!
        div.style.opacity = '0'
    }
}
