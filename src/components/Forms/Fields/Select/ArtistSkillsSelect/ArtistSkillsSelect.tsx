import { getArtistsSkills } from "@/backend/api/artists"
import { artistsSkillsAtom } from "@/store"
import MenuItem from "@mui/material/MenuItem"
import Select, { SelectProps } from "@mui/material/Select"
import Typography from "@mui/material/Typography"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"

export type ArtistSkillsSelectProps = SelectProps & {
    value?: string[] | string
}


const ArtistSkillsSelect = (props : ArtistSkillsSelectProps) => {
    const {multiple, value, ...restProps} = props
    const [skillsNames] = useAtom(artistsSkillsAtom)
    useEffect( () => getArtistsSkills() ,[])

    return <Select
            displayEmpty
            multiple={multiple}
            defaultValue={multiple ? [] : ''}
            renderValue={(selected) => {
                console.log("selected : ", selected)
                if(multiple && Array.isArray(selected) && selected.length > 0 ){
                  return (selected as unknown as Array<string>).join(', ')
                }
                if(typeof selected === 'string' && selected !== '' ) return selected
                return <Typography sx={{color: 'text.secondary'}} >Select Skills</Typography>
            }}
            {...restProps}
        >
          <MenuItem disabled value='' >Skills</MenuItem>
          {skillsNames.map(skillName => <MenuItem
            key={skillName}
            value={skillName}
          >
            {skillName}
          </MenuItem>)}
        </Select>
}

export default ArtistSkillsSelect