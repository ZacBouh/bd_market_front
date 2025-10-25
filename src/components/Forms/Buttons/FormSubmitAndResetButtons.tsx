import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"

export type FormSubmitAndResetButtonsProps = {
    alignment?: 'start' | 'center' | 'end'
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
    const alignment = props.alignment ?? 'end'
    const justifyContent = alignment === 'start' ? 'flex-start' : alignment === 'center' ? 'center' : 'flex-end'
    const alignSelf = {
        xs: 'stretch',
        sm: alignment === 'end' ? 'flex-end' : alignment === 'start' ? 'flex-start' : 'center',
    }
    const width = alignment === 'end' ? '100%' : { xs: '100%', sm: 'auto' }

    return (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent={{ sm: justifyContent }}
            alignItems={alignment === 'center' ? { xs: 'stretch', sm: 'center' } : undefined}
            sx={{ alignSelf, width }}
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
