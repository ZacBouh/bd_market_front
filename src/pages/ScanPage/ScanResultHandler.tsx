import { findTitles} from "@/backend/api/title"
import AddCopyForm from "@/components/Forms/AddCopyForm/AddCopyForm"
import TitleForm from "@/components/Forms/TitleForm/TitleForm"
import TitleGallery from "@/components/Gallery/TitleGallery/TitleGallery"
import { SupportedLanguage } from "@/types/common"
import { Button, Stack } from "@mui/material"
import Box from "@mui/material/Box/Box"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

export type ScanResultHandlerProps = {
    resetHandler?: (...arg: any[]) => any
    data?: {
        existingData?: {
            artistsCandidates?: {id: number, firstName: string, lastName: string, skill: string}[]
            publishersCandidates?: {id: number, name: string, }[]
            titleCandidates?: {id: number, name: string}[]
        }
        result: {
            name?: string,
            language?: SupportedLanguage,
            description?: string,
            collection?: string,
            series?: string
            isbn?: string, 
            publisher?: {name: string, id: number},
            artistsContributions?: { firstName: string, lastName: string, skill: string}[]
        }
    }
}

const ScanResultHandler = (props : ScanResultHandlerProps) => {
    const [titles, setTitles] = useState<CreatedTitle[]>([])
    const {artistsCandidates, publishersCandidates, titleCandidates} = props.data?.existingData ?? {}
    const [matchingTitle, setMatchingTitle] = useState<CreatedTitle | undefined>()
    const [titleSkipped, setTitleSkipped] = useState(false)
    const [createdTitle, setCreatedTitle] = useState<CreatedTitle | undefined>()
    useEffect(() => {
        if(titleCandidates && titleCandidates.length > 0){
            const abortFun = findTitles(titleCandidates.map(title => title.id), (titles) => setTitles(titles))
            return abortFun
        } 
        setTitleSkipped(true)
    }, [titleCandidates])
    const artistsCandidatesContributions = (() => {
        const contributionsMap : Record<number, string[]> = {}
        artistsCandidates?.map(artist => {
            contributionsMap[artist.id] = contributionsMap?.[artist.id] ? [...contributionsMap[artist.id], artist.skill] : [artist.skill] 
        })
        const contributions : {artist: number, skills: string[]}[] = []
        Object.keys(contributionsMap).map(key => contributions.push({artist: Number(key), skills: contributionsMap[Number(key)]}))
        return contributions 
    })()
    const artistsCandidatesMap = (() => {
        let map : Record<number, NonNullable<typeof  artistsCandidates>[number]> = {} 
        artistsCandidates?.map(artist => map[artist.id] = artist )
        return map
    })() 
    console.log("Map",artistsCandidatesMap)
    console.log("New Contributions = ", artistsCandidatesContributions)
    const navigate = useNavigate()
    return <Box>
        Scan Result Handler
        <Button onClick={() => props.resetHandler && props.resetHandler()}>Reset</Button>    
        {props.data && 
            <Button onClick={() => console.log(props.data)}>Data</Button>    
        }
        { titles && !createdTitle && <Stack direction='column'>
                <TitleGallery titles={titles} onTitleClick={(title) =>{
                    setMatchingTitle(title)
                    setTitleSkipped(false)
                }}/>
                <Button onClick={() => setTitleSkipped(true)} >No Title Match</Button>
            </Stack>
        }
        { matchingTitle && !titleSkipped &&
            <AddCopyForm title={matchingTitle} />
        }
        { (artistsCandidates || publishersCandidates || props.data?.result)  && titleSkipped && !createdTitle  &&
            <TitleForm
                prePopulatedName={props.data?.result.name}
                language={props.data?.result.language}
                description={props.data?.result.description}
                publisher={publishersCandidates?.[0]}
                artistsContributions={artistsCandidatesContributions}
                artistsMap={artistsCandidatesMap}
                isbn={props.data?.result.isbn}
                onTitleCreated={(title) => setCreatedTitle(title)}
            />
        }
        {   createdTitle && 
            <AddCopyForm title={createdTitle} onCopyCreated={(copy) => {
                console.log('Created Copy ', copy)
                navigate('/library')
            }} />
        }
        <Button onClick={() => console.log(props)}>Log Result</Button>
    </Box>
}

export default ScanResultHandler