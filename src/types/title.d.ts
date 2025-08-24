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

type NewArtistContribution = {
    artist: CreatedArtist['id']
    skills: string[]
}

type CreatedContribution = {
    artist: {id: CreatedArtist['id'], fullName: string}
    skills: string[]
    title: number
}

type NewTitleFormState = NewTitle & {
  coverImageFile: File | undefined
}
