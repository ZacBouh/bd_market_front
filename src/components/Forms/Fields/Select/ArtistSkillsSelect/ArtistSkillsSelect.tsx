import { getArtistsSkills } from "@/backend/api/artist"
import { artistsSkillsAtom } from "@/store"
import { Autocomplete, TextField } from "@mui/material"
import type { SxProps, Theme } from "@mui/material/styles"
import { useAtom } from "jotai"
import { useEffect, useMemo } from "react"

type ArtistSkillOption = { label: string, value: string }

type BaseArtistSkillsSelectProps = {
    sx?: SxProps<Theme>
    label?: string
    required?: boolean
    disabled?: boolean
    fullWidth?: boolean
}

type MultipleArtistSkillsSelectProps = BaseArtistSkillsSelectProps & {
    multiple: true
    value?: string[]
    onChange?: (value: string[]) => void
}

type SingleArtistSkillsSelectProps = BaseArtistSkillsSelectProps & {
    multiple?: false
    value?: string
    onChange?: (value: string) => void
}

export type ArtistSkillsSelectProps = MultipleArtistSkillsSelectProps | SingleArtistSkillsSelectProps

const defaultLabel = "Select skills"

const ArtistSkillsSelect = (props : ArtistSkillsSelectProps) => {
    const { multiple } = props
    const [skillsNames] = useAtom(artistsSkillsAtom)

    useEffect(() => { getArtistsSkills() }, [])

    const options = useMemo<ArtistSkillOption[]>(() => skillsNames.map(skillName => ({
        label: skillName,
        value: skillName,
    })), [skillsNames])

    const label = props.label ?? defaultLabel

    if(multiple){
        const value = props.value ?? []
        const selectedOptions = options.filter(option => value.includes(option.value))

        return <Autocomplete<ArtistSkillOption, true, false, false>
            multiple
            disableCloseOnSelect
            options={options}
            value={selectedOptions}
            onChange={(_, selected) => {
                const nextValues = selected.map(option => option.value)
                props.onChange?.(nextValues)
            }}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, selected) => option.value === selected.value}
            renderInput={(params) => <TextField {...params} required={props.required} label={label} />}
            sx={props.sx}
            fullWidth={props.fullWidth}
            disabled={props.disabled}
        />
    }

    const selectedOption = props.value ? options.find(option => option.value === props.value) ?? null : null

    return <Autocomplete<ArtistSkillOption, false, false, false>
        options={options}
        value={selectedOption}
        onChange={(_, selected) => {
            props.onChange?.(selected?.value ?? '')
        }}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, selected) => option.value === selected.value}
        renderInput={(params) => <TextField {...params} required={props.required} label={label} />}
        sx={props.sx}
        fullWidth={props.fullWidth}
        disabled={props.disabled}
    />
}

export default ArtistSkillsSelect
