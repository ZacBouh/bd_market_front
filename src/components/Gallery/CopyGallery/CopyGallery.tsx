import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Grid2 from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useState } from 'react'
import { useNotifications } from '@toolpad/core/useNotifications'

import { API_BASE_URL } from '@/backend/api/api'
import { getCopies, removeCopy, updateCopy } from '@/backend/api/copy'
import ButtonMenu from '@/components/Menu/ButtonMenu/ButtonMenu'
import EditCopyModal from '@/components/Forms/AddCopyForm/EditCopyModal'
import objectToFormData from '@/utils/formData'
import PutCopyForSaleModal from './PutCopyForSaleModal'

interface CopyGalleryProps {
    copies: CreatedCopy[]
    disableContainer?: boolean
}

const CopyGallery = ({ copies, disableContainer = false }: CopyGalleryProps) => {
  const [editCopyModalOpen, setEditCopyModalOpen] = useState(false)
  const [editedCopy, setEditedCopy] = useState<CreatedCopy | undefined>(undefined)
  const [forSaleModalState, setForSaleModalState] = useState<{
    open: boolean
    copy?: CreatedCopy
    loading: boolean
  }>({ open: false, copy: undefined, loading: false })
  const notifications = useNotifications()

  const closeForSaleModal = () => setForSaleModalState({ open: false, copy: undefined, loading: false })

  const openForSaleModal = (copy: CreatedCopy) => {
    setForSaleModalState({ open: true, copy, loading: false })
  }

  const submitForSale = (price: Price) => {
    const targetCopy = forSaleModalState.copy
    if (!targetCopy) {
      return
    }
    setForSaleModalState((prev) => ({ ...prev, loading: true }))
    const payload = objectToFormData({
      ...targetCopy,
      forSale: true,
      price: price.amount,
      currency: price.currency,
      titleId: targetCopy.title.id,
      ownerId: targetCopy.owner.id,
    })
    updateCopy(payload, () => {
      notifications.show('Copy listed for sale successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      })
      closeForSaleModal()
    })
  }

  const galleryContent = copies.length ? (
    <Grid2 container spacing={{ xs: 2.5, sm: 3, md: 4 }}>
      {copies.map((copy) => (
        <Grid2 key={copy.id} xs={12} sm={6} md={4} lg={3}>
          <Card
            sx={(theme) => ({
              height: '100%',
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.background.paper, 0.65)
                  : alpha(theme.palette.background.paper, 0.92),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              boxShadow: theme.shadows[3],
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: theme.shadows[12],
              },
            })}
          >
            <CardActionArea sx={{ flexGrow: 1 }}>
              <CardMedia
                component="img"
                height="300"
                image={API_BASE_URL + copy?.coverImage?.url}
                alt={copy?.coverImage?.imageName}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Stack spacing={0.5}>
                  <Typography variant="h6">{copy.title.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {copy?.title?.artistsContributions?.[0].artist.fullName}
                  </Typography>
                </Stack>
              </CardContent>
            </CardActionArea>
            <CardActions sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', p: 2 }}>
              <Stack direction="row" spacing={1}>
                {copy.price && (
                  <Chip
                    label={`${copy.price} ${copy.currency}`}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                )}
                <Chip label={copy.copyCondition} size="small" variant="outlined" color="secondary" />
              </Stack>
              <ButtonMenu
                ButtonElement={IconButton}
                buttonProps={{ children: <MoreVertIcon />, sx: { ml: 'auto', borderRadius: 2 } }}
                menuItems={[
                  {
                    label: copy.forSale ? 'Remove From Sale' : 'Put For Sale',
                    handleClick: () => {
                      if (copy.forSale) {
                        const payload = objectToFormData({
                          ...copy,
                          forSale: false,
                          titleId: copy.title.id,
                          ownerId: copy.owner.id,
                        })
                        updateCopy(payload, (data) => console.log('Successfully removed copy from sale: ', data))
                      } else {
                        openForSaleModal(copy)
                      }
                    },
                  },
                  {
                    label: 'Remove from library',
                    handleClick: () => {
                      console.log('removing copy with id: ', copy.id)
                      removeCopy(copy.id, (response) => {
                        console.log(response?.message)
                        getCopies()
                      })
                    },
                  },
                  {
                    label: 'Edit Copy',
                    handleClick: () => {
                      setEditCopyModalOpen(true)
                      setEditedCopy(copy)
                    },
                  },
                ]}
              />
            </CardActions>
          </Card>
        </Grid2>
      ))}
    </Grid2>
  ) : (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: 260,
        borderRadius: 3,
        border: (theme) => `1px dashed ${alpha(theme.palette.text.primary, 0.2)}`,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.4)
            : alpha(theme.palette.primary.light, 0.08),
        textAlign: 'center',
        px: { xs: 4, md: 6 },
        py: { xs: 5, md: 6 },
      }}
    >
      <Typography variant="h6">You have not added any copies yet</Typography>
      <Typography variant="body2" color="text.secondary">
        Start by adding a copy using the form and your collection will appear here automatically.
      </Typography>
    </Stack>
  )

  const content = (
    <>
      {galleryContent}
      <EditCopyModal open={editCopyModalOpen} handleClose={() => setEditCopyModalOpen(false)} copy={editedCopy} />
      <PutCopyForSaleModal
        open={forSaleModalState.open}
        copy={forSaleModalState.copy}
        loading={forSaleModalState.loading}
        onClose={closeForSaleModal}
        onSubmit={submitForSale}
      />
    </>
  )

  if (disableContainer) {
    return content
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {content}
    </Container>
  )
}

export default CopyGallery
