import AppModal from '@/components/Common/AppModal'
import AddPhotoIcon from '@mui/icons-material/AddAPhoto'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { useState } from 'react'
import ScanForm from '../ScanForm/ScanForm'

type AddScanImageButtonProps = {
  label: string
  onSelectedImage: (imageFile: File) => unknown
  selectedImage?: File
}

type AddScanImageButtonState = {
  modalOpen: boolean
  selectedImage?: File
}

const AddScanImageButton = (props: AddScanImageButtonProps) => {
  const [state, setState] = useState<AddScanImageButtonState>({
    modalOpen: false,
    selectedImage: undefined,
  })
  const selectedImage = props.selectedImage ?? state.selectedImage
  return (
    <Box display="flex" justifyContent="center">
      <Card onClick={() => setState((prev) => ({ ...prev, modalOpen: true }))} sx={{ px: 4 }}>
        <CardContent
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxHeight: 400, maxWidth: 200, justifyContent: 'center' }}
        >
          {!selectedImage && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} component="div">
              <AddPhotoIcon sx={{ fontSize: 150 }} />
              <Typography>{props.label ?? 'Add Image'}</Typography>
            </Box>
          )}
          {selectedImage && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
              <img
                src={URL.createObjectURL(selectedImage)}
                style={{
                  inset: 0,
                  width: 'auto',
                  height: selectedImage ? 300 : 'auto',
                  objectFit: 'contain',
                }}
              />
              <Typography sx={{ mt: 2 }}>{props.label ?? 'Add Image'}</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
      <AppModal
        open={state.modalOpen}
        onClose={() => setState((prev) => ({ ...prev, modalOpen: false }))}
        contentProps={{
          sx: {
            width: 'min(960px, calc(100% - 32px))',
            minHeight: '60vh',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0,
          },
        }}
      >
        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
          <ScanForm
            onCropImage={(image) => {
              if (props.onSelectedImage) {
                props.onSelectedImage(image)
                setState((prev) => ({ ...prev, modalOpen: false }))
              } else {
                setState((prev) => ({ ...prev, selectedImage: image, modalOpen: false }))
              }
            }}
          />
        </Box>
      </AppModal>
    </Box>
  )
}

export default AddScanImageButton
