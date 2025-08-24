type NewSeries = {
    id? : number , 
    name : string , 
    publisherId : number , 
    titlesId?: number[] ,
    coverImageFile? : File,
    language: SupportedLanguage,
    onGoingStatus?: OnGoingStatus, 
}

type CreatedSeries = NewSeries & {
    id : NewSeries['id']
    createdAt: string, 
    updatedAt: string,
    coverImage?: UploadedImage
    uploadedImages?: UploadedImage[]
}