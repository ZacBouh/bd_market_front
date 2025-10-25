import AppModal from '@/components/Common/AppModal'
import { Button, Stack, Typography } from '@mui/material'
import AddCopyForm from './AddCopyForm'

type EditCopyModalProps = {
  open: boolean
  handleClose: (...args: any[]) => void
  copy: CreatedCopy | undefined
}

const EditCopyModal = (props: EditCopyModalProps) => {
  const { open, copy, handleClose } = props

  return (
    <AppModal open={open} onClose={handleClose}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h5">Edit {copy?.title.name}</Typography>
          <Button color="inherit" onClick={() => handleClose()}>
            Close
          </Button>
        </Stack>
        <AddCopyForm copyToEdit={copy} />
      </Stack>
    </AppModal>
  )
}

export default EditCopyModal
