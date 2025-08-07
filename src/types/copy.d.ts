type CopyCondition = 'mint' | 'near_mint'| 'very_fine'| 'fine'| 'very_good'| 'good'| 'fair'| 'poor'

type NewCopy = {
    ownerId: number | null ,
    titleId?: number | null ,
    copyCondition?:  CopyCondition | null,
    price?: string | null,
    currency?: string | null,
    boughtForPrice?: string | null ,
    boughtForCurrency?: string | null,    
    coverImageFile?: File | undefined,
}

type CreatedCopy = NewCopy  & {
    id: number,
    createdAt: string,
    updatedAt: string,
}
