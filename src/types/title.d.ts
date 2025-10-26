type NewTitle = {
    name: string,
    releaseDate: string | null,
    language: string | null,
    artistsContributions : NewArtistContribution[],
    publisher: CreatedPublisher['id'] | null, 
    description: string
    isbn?: string,
    series?: string
}
type NewTitleFormState = NewTitle & {
  coverImageFile: File | undefined
}

type CreatedTitle = Omit<NewTitle, 'publisher'> & {
    id: number,
    createdAt: string,
    updatedAt: string,
    coverImage: UploadedImage
    uploadedImages: UploadedImage[]
    artistsContributions : CreatedContribution[] | Record<string | number, CreatedContribution>
    publisher: CreatedPublisher | null
}

type NewArtistContribution = {
    artist: CreatedArtist['id']
    skills: string[]
}

type CreatedArtistContribution = NewArtistContribution & {
    id: number,
    title: CreatedTitle['id']
}

type ContributionArtist = {
    id: CreatedArtist['id']
    fullName?: string | null
    name?: string | null
} & Partial<Pick<CreatedArtist, 'firstName' | 'lastName' | 'pseudo'>>

type CreatedContribution = {
    artist: ContributionArtist
    skills: string[]
    title: number
}
