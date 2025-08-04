import { Box, Button, Stack } from "@mui/material"
import ArtistAutocomplete from "../ArtistAutocomplete/ArtistAutocomplete"
import ArtistSkillsSelect from "../../Select/ArtistSkillsSelect/ArtistSkillsSelect"
import AddIcon from '@mui/icons-material/Add'

const artists = [0]

const MultiArtistAutocomplete = () => {
    return <Box sx={{width: '100%'}}>
        {artists.map( (artist, index, artists) => {
            return  <Stack direction={'row'} key={index} sx={{width: '100%'}} >
                <ArtistAutocomplete sx={{flex: 1}} />
                <ArtistSkillsSelect multiple  sx={{flex: 1}} />
                <Button 
                    onClick={() => artists.push(index+1)}
                ><AddIcon/></Button>
            </Stack>
        })}
    </Box> 
}

export default MultiArtistAutocomplete