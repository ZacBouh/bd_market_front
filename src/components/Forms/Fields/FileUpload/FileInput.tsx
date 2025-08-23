import { Button, ButtonProps, Stack, StackProps, Typography } from "@mui/material"
import React, { useState } from "react"

export type FileInputProps = React.InputHTMLAttributes<HTMLInputElement> & ButtonProps & StackProps & {
    label?: React.ReactNode,
    onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => any,
    selectedFileNamePrefix?: string, 
    inputName?: string
}


const FileInput = (props : FileInputProps) => {
    const {id, variant, component, label, sx, direction, onFileChange, selectedFileNamePrefix, accept, ...restProps} = props
    const [fileName, setFileName] = useState('')
    const inputId = (id ?? crypto.randomUUID()) + '_file_upload'
    const inputName = props.inputName ?? "coverImageFile"

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event?.target?.files?.[0]
        if(file){
            setFileName(file.name)
        }
        onFileChange && onFileChange(event)
    }

    return <Stack direction={direction ?? "row"} {...{id}}>
        <input
            accept={accept} 
            type="file"
            style={{display: 'none'}}
            id={inputId}
            onChange={handleFileChange}
            name={inputName}
        />
        <label htmlFor={inputId}>
            <Button variant={variant ?? "outlined"} component={component ?? "span"} {...{sx}} >
                {label ?? 'Choose a file'}
            </Button>
        </label>
        {fileName && (
            <Typography variant="body2" sx={{m: 1}} >
                {selectedFileNamePrefix ?? ''}{fileName}
            </Typography>
        )}
    </Stack>

}

export default FileInput