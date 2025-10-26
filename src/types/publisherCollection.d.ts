import type { SupportedLanguage } from "./common"

declare global {
    type NewPublisherCollection = {
        name : string,
        publisherId : number,
        language: SupportedLanguage,
        titleIds? : string,
        description? : string,
        birthDate? : string,
        deathDate? : string,
        coverImageFile? : File,
    }

    type CreatedPublisherCollection = Omit<NewPublisherCollection, 'titleIds' | 'coverImageFile' | 'publisherId'> & {
        id: number
        publisher: CreatedPublisher
        createdAt: string,
        updatedAt: string,
        coverImage?: UploadedImage
    }
}

export {}