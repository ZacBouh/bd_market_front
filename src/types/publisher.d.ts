type NewPublisher = {
    name: string,
    birthDate?: string | null,
    deathDate?: string | null, 
    description?: string | null,
    coverImageFile?: File | undefined     
}

type CreatedPublisher = NewPublisher & {
    id: number,
    createdAt?: string,
    updatedAt?: string,
    coverImage?: UploadedImage,
}
