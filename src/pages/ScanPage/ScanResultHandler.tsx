import { findTitles} from "@/backend/api/title"
import AddCopyForm from "@/components/Forms/AddCopyForm/AddCopyForm"
import TitleForm from "@/components/Forms/TitleForm/TitleForm"
import TitleGallery from "@/components/Gallery/TitleGallery/TitleGallery"
import { SupportedLanguage } from "@/types/common"
import { Button, Stack, Typography } from "@mui/material"
import Box from "@mui/material/Box/Box"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

export type ScanResultHandlerProps = {
    resetHandler?: (...arg: any[]) => any
    data?: {
        existingData?: {
            artistsCandidates?: {id: number, firstName: string, lastName: string, pseudo:string, skill: string}[]
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
    const navigate = useNavigate()
    return <Stack spacing={{ xs: 4, md: 5 }} sx={{ width: '100%' }}>
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            spacing={2}
        >
            <Box sx={{ maxWidth: 520 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Review Scan Results
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Select the matching title below or create a new one if you cannot find a match.
                </Typography>
            </Box>
            <Button
                variant="outlined"
                color="secondary"
                onClick={() => props.resetHandler && props.resetHandler()}
                sx={{ fontWeight: 600 }}
            >
                Start Over
            </Button>
        </Stack>
        { titles && !createdTitle && <Stack direction='column' spacing={{ xs: 4, sm: 5 }} alignItems='center' sx={{ width: '100%' }}>
                <TitleGallery titles={titles} onTitleClick={(title) =>{
                    setMatchingTitle(title)
                    setTitleSkipped(false)
                }}/>
                <Stack spacing={1.5} alignItems='center' sx={{ width: '100%' }}>
                    <Typography variant="subtitle1" color="text.secondary">
                        Not seeing the right title?
                    </Typography>
                    <Button
                        onClick={() => setTitleSkipped(true)}
                        variant="contained"
                        color="secondary"
                        size="large"
                        sx={(theme) => ({
                            px: 5,
                            py: 1.5,
                            fontWeight: 700,
                            borderRadius: theme.shape.borderRadius * 1.5,
                            boxShadow: theme.shadows[6],
                        })}
                    >
                        No Title Match
                    </Button>
                </Stack>
            </Stack>
        }
        { matchingTitle && !titleSkipped &&
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <AddCopyForm title={matchingTitle} />
            </Box>
        }
        { (artistsCandidates || publishersCandidates || props.data?.result)  && titleSkipped && !createdTitle  &&
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
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
            </Box>
        }
        {   createdTitle &&
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <AddCopyForm title={createdTitle} onCopyCreated={(copy) => {
                    console.log('Created Copy ', copy)
                    navigate('/library')
                }} />
            </Box>
        }
    </Stack>
}

export default ScanResultHandler
