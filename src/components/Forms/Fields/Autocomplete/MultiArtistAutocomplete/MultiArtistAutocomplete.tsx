import { Box, BoxProps, Button,  Stack } from "@mui/material"
import ArtistAutocomplete, { ArtistAutocompleteProps } from "../ArtistAutocomplete/ArtistAutocomplete"
import ArtistSkillsSelect, { ArtistSkillsSelectProps } from "../../Select/ArtistSkillsSelect/ArtistSkillsSelect"
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from "react"

export type MultiArtistAutocompleteEntry = {
    _id: string
    artist : CreatedArtist['id'] | null,
    skills : string[]
}

export type MultiArtistAutocompleteProps = BoxProps & Omit<ArtistSkillsSelectProps, 'multiple' | 'onChange' | 'value'> & ArtistAutocompleteProps & {
    onMultiArtistChange?: (value : MultiArtistAutocompleteEntry[]) => any
    artistsContributions?: NewArtistContribution[]
    artistsMap?: Record<number, {id: number, firstName: string, lastName: string, pseudo: string}>
}

const MultiArtistAutocomplete = (props : MultiArtistAutocompleteProps) => {
    const {sx, onMultiArtistChange} = props
    const emptyArtistEntry = (() => ({ _id: crypto.randomUUID() , artist: null, skills: []}))()
    const prePopulatedEntries : MultiArtistAutocompleteEntry[] | undefined = props.artistsContributions ? props.artistsContributions.map(contribution => ({
        _id: crypto.randomUUID(),
        artist: contribution.artist,
        skills: contribution.skills
    })) : undefined
    const hasPrepolutedEntries = props.artistsContributions && !!props.artistsMap
    const [artists, setArtists] = useState<MultiArtistAutocompleteEntry[]>(prePopulatedEntries ?? [emptyArtistEntry])
    const triggerOnMultiArtistChange = (value : MultiArtistAutocompleteEntry[]) =>  onMultiArtistChange &&  onMultiArtistChange(value)
    return <Box sx={sx ?? {width: '100%'}}>
        {artists.map( (entry, index) => {
            return  <Stack direction={'row'} key={entry._id} sx={{width: '100%'}} >
                <ArtistAutocomplete 
                    sx={{flex: 1}}
                    onChangeCallback={(_, artist) =>{
                        const updatedArtists = replaceInArrayAtIndex(artists, index, {...entry, artist : artist?.id ?? null}) 
                        setArtists(updatedArtists)
                        triggerOnMultiArtistChange(updatedArtists)
                    }}
                    // @ts-ignore
                    value={(hasPrepolutedEntries && entry.artist) ? {...props?.artistsMap?.[entry?.artist], coverImage: undefined }: undefined} 
                 />
                <ArtistSkillsSelect
                    multiple
                    value={entry.skills}
                    sx={{flex: 1}}
                    onChange={(skills) =>{
                        const updatedArtists = replaceInArrayAtIndex(artists, index, {...artists[index], skills })
                        setArtists(updatedArtists)
                        triggerOnMultiArtistChange(updatedArtists)
                    }}
                />
                <Button 
                    onClick={() => setArtists(artists => removeFromArrayAtIndex(artists, index))}
                    ><DeleteIcon/></Button>
            </Stack>
            
        })}
        <Button 
            onClick={() => setArtists(artists => [...artists, emptyArtistEntry])}
            sx={{width: '100%'}}
            ><AddIcon/> Add Artist Contribution</Button>
    </Box> 
}

function removeFromArrayAtIndex<T>( array : T[], index: number): T[]  {
    return [...array.slice(0, index), ...array.slice(index+1)]
}
function replaceInArrayAtIndex<T>(array : T[], index: number, element: T): T[]{
    return [...array.slice(0, index), element, ...array.slice(index+1)]
}

export default MultiArtistAutocomplete
