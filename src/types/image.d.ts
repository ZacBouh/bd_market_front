type UploadedImage = {
    id: number,
    fileName: string,
    originalFileName: string | null,
    fileMimeType: string | null,
    fileSize: number,
    imageDimensions: string | null | { width: number; height: number },
    imageName: string,
    url: string,
    updatedAt: string,
    createdAt?: string,
}
