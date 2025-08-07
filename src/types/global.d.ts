type LoginCredentials = {
    email: string,
    password: string
}

type NewUser = LoginCredentials & {
    pseudo: string
}

type CreatedUser = NewUser & {
    id: number,
    createdAt: string,
    updatedAt: string,
    role: string[]
}

type LoggedInUser = {
    user : CreatedUser,
    token: string
}

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
    coverImageFile: File | undefined     
}

type CreatedPublisher = NewPublisher & {
    id: number,
    createdAt: string,
    updatedAt: string,
    coverImage: UploadedImage,
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

type ArtistForm = {
    firstName: string,
    lastName: string,
    pseudo: string,
    dateOfBirth: string | null,
    dateOfDeath: string | null,
    skills: string[],
    coverImageFile: File | undefined    
}

type CopyCondition = 'mint' | 'near_mint'| 'very_fine'| 'fine'| 'very_good'| 'good'| 'fair'| 'poor'

type NewCopy = {
    ownerId: number | null ,
    titleId?: number | null ,
    copyCondition?:  CopyCondition | null,
    price?: string | null,
    currency?: string | null,
    boughtForPrice?: string | null ,
    boughtForCurrency?: string | null,    
    coverImage?: File | undefined,
}

type CreatedCopy = NewCopy  & {
    id: number,
    createdAt: string,
    updatedAt: string,
}

type AutoCompleteFieldState<T> = {
    inputValue : string,
    prevInputValue: string,
    value: T | null,
    modalOpen: boolean
}

type AcceptedCurrency = 'euro'

type Price = {
    amount: string,
    currency: AcceptedCurrency
}