type UploadedImage = {
    id: number, 
    fileName: string,
    originalFileName: string | null,
    fileMimeType: string | null,
    fileSize: number,
    imageDimensions: string | null,
    imageName: string,
    url: string,
    updatedAt: string
}

type NewTitle = {
    name: string,
    releaseDate: string | null,
    language: string | null,
    artistsContributions : NewArtistContribution[],
    publisher: CreatedPublisher['id'] | null, 
    description: string
}

type CreatedTitle = NewTitle & {
    id: number,
    createdAt: string, 
    updatedAt: string,
    coverImage: UploadedImage
    uploadedImages: UploadedImage[]
    artistsContributions : CreatedContribution[]
}

type NewPublisher = {
    name: string,
    birthDate: string | null,
    deathDate: string | null, 
    description: string | null,    
}

type CreatedPublisher = NewPublisher & {
    id: number,
    createdAt: string,
    updatedAt: string
}

type NewArtist = {
    "firstName": string | null,
    "lastName": string | null,
    "pseudo": string | null,
    "birthDate"?: string | null,
    "deathDate"?: string | null,
    "skills"?: string[]
}

type CreatedArtist = NewArtist & {
    id: number,
    coverImage: UploadedImage
}

type NewArtistContribution = {
    artist: CreatedArtist['id']
    skills: string[]
}

type CreatedContribution = {
    artist: {id: CreatedArtist['id'], fullName: string}
    skills: string[]
    title: number
}

type AuthorFormState = {
    firstName: string,
    lastName: string,
    pseudo: string,
    dateOfBirth: string | null,
    dateOfDeath: string | null,
    skills: string[],
    coverImageFile: File | undefined    
}