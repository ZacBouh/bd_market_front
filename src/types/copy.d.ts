type CopyCondition = 'mint' | 'near_mint'| 'very_fine'| 'fine'| 'very_good'| 'good'| 'fair'| 'poor'

type NewCopy = {
    ownerId: number | null  ,
    titleId?: number,
    copyCondition?:  CopyCondition,
    price?: string,
    currency?: AcceptedCurrency,
    boughtForPrice?: string,
    boughtForCurrency?: AcceptedCurrency,    
    coverImageFile?: File,
    forSale?: boolean
}

type CreatedCopy = Omit<NewCopy, 'ownerId' | 'titleId'>  & {
    id: number,
    createdAt: string,
    updatedAt: string,
    owner: Partial<CreatedUser>,
    title: Partial<CreatedTitle>,
    coverImage: UploadedImage
}

type DetailedCopy = CreatedCopy & {
    uploadedImages?: UploadedImage[],
}
