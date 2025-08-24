type NewSeries = {
    id? : number , 
    name : string , 
    publisherId : number , 
    titlesId?: number[] ,
    coverImageFile? : File,
    language: SupportedLanguage,
    onGoingStatus?: OnGoingStatus, 
}

type CreatedSeries = Omit<NewSeries, 'publisherId' | 'titlesId' | 'coverImageFile' > & {
    id : NewSeries['id']
    createdAt: string, 
    updatedAt: string,
    coverImage?: UploadedImage
    uploadedImages?: UploadedImage[]
    publisher: Partial<CreatedPublisher>
}