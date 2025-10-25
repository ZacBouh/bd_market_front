import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"

export type FormSubmitAndResetButtonsProps = {
    handleReset?: (...args: unknown[]) => unknown
    logLabel?: string
    logButtonLabel?: string
    resetLabel?: string
    submitLabel?: string
    state: unknown
}

const FormSubmitAndResetButtons = (props: FormSubmitAndResetButtonsProps) => {
    const handleReset = props.handleReset ?? (() => console.log("Reset not handled"))
    const env = import.meta.env.VITE_ENV
    const logLabel = props.logLabel ?? "Form values"
    const resetLabel = props.resetLabel ?? "Reset"
    const submitLabel = props.submitLabel ?? "Save"
    const logButtonLabel = props.logButtonLabel ?? "Show log"

    return (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent={{ sm: 'flex-end' }}
            sx={{ alignSelf: { xs: 'stretch', sm: 'flex-end' }, width: '100%' }}
        >
            <Button variant="outlined" color="secondary" onClick={handleReset}>
                {resetLabel}
            </Button>
            <Button type='submit' variant="contained">
                {submitLabel}
            </Button>
            {env === 'dev' && (
                <Button variant="text" color="inherit" onClick={() => console.info(logLabel, props.state)}>
                    {logButtonLabel}
                </Button>
            )}
        </Stack>
    )
}

export default FormSubmitAndResetButtons
