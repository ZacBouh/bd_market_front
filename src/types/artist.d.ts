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

type ArtistForm = {
    firstName: string,
    lastName: string,
    pseudo: string,
    dateOfBirth: string | null,
    dateOfDeath: string | null,
    skills: string[],
    coverImageFile: File | undefined    
}
