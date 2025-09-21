import { findTitles} from "@/backend/api/title"
import TitleGallery from "@/components/Gallery/TitleGallery/TitleGallery"
import { Button, Card, CardContent } from "@mui/material"
import Box from "@mui/material/Box/Box"
import { useEffect, useState } from "react"

export type ScanResultHandlerProps = {
    resetHandler?: (...arg: any[]) => any
    data?: {
        existingData?: {
            artistsCandidates?: {id: number, lastName: string, skill: string}[]
            publisherCandidates?: {id: number, name: string, }[]
            titleCandidates?: {id: number, name: string}[]
        }
        result: {
            name?: string,
            language?: string,
            description?: string,
            collection?: string,
            series?: string
            isbn?: string, 
            publisher?: {name: string, language: string},
            artistsContributions?: {firstName: string, lastName: string, skill: string}[]
        }
    }
}

const ScanResultHandler = (props : ScanResultHandlerProps) => {
    const [titles, setTitles] = useState<CreatedTitle[]>([])
    const {artistsCandidates, publisherCandidates, titleCandidates} = props.data?.existingData ?? {}
    useEffect(() => {
        if(titleCandidates){
            const abortFun = findTitles(titleCandidates.map(title => title.id), (titles) => setTitles(titles))
            return abortFun
        } 
    }, [titleCandidates])
    return <Box>
        Scan Result Handler
        <Button onClick={() => props.resetHandler && props.resetHandler()}>Reset</Button>    
        {props.data && 
            <Button onClick={() => console.log(props.data)}>Data</Button>    
        }
        { titles && <TitleGallery titles={titles} />
        }
    </Box>
}

export default ScanResultHandler