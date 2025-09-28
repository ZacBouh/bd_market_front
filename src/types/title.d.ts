type NewTitle = {
    name: string,
    releaseDate: string | null,
    language: string | null,
    artistsContributions : NewArtistContribution[],
    publisher: CreatedPublisher['id'] | null, 
    description: string
    isbn?: string
}
type NewTitleFormState = NewTitle & {
  coverImageFile: File | undefined
}

type CreatedTitle = NewTitle & {
    id: number,
    createdAt: string, 
    updatedAt: string,
    coverImage: UploadedImage
    uploadedImages: UploadedImage[]
    artistsContributions : CreatedContribution[]
}

type NewArtistContribution = {
    artist: CreatedArtist['id']
    skills: string[]
}

type CreatedArtistContribution = NewArtistContribution & {
    id: number,
    title: CreatedTitle['id']
}

type CreatedContribution = {
    artist: {id: CreatedArtist['id'], fullName: string}
    skills: string[]
    title: number
}
