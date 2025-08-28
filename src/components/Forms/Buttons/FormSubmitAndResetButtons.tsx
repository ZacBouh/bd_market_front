import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

export type FormSubmitAndResetButtonsProps = {
    handleReset?: (...args: unknown[]) =>  unknown
    logLabel?: string
    state: unknown
}

const FormSubmitAndResetButtons = (props : FormSubmitAndResetButtonsProps) => {
    const handleReset = props.handleReset ?? (() => console.log("Reset not handled"))
    const env = import.meta.env.VITE_ENV
    const logLabel = props.logLabel ?? "Content of the Form "
    return <Box sx={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: 1}} >
        {env === 'dev' && 
            <Button onClick={() => console.info(logLabel, props.state)} >Log Content</Button>
        }
        <Button onClick={handleReset} >Reset</Button>
        <Button type='submit' >Ajouter</Button>
    </Box>
}

export default FormSubmitAndResetButtons