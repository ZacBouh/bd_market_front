import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid2 from '@mui/material/Grid2'
import { useEffect } from 'react'

import AddCopyForm from '@/components/Forms/AddCopyForm/AddCopyForm'
import CopyGallery from '@/components/Gallery/CopyGallery/CopyGallery'
import { getCopies } from '@/backend/api/copy'
import { useCopy } from '@/hooks/useCopy'

function UserLibraryPage() {
  const { copies } = useCopy()

  useEffect(() => {
    return getCopies()
  }, [])

  return (
    <>
      <meta name="title" content="Page 4" />
      <Box
        sx={(theme) => ({
          backgroundImage:
            theme.palette.mode === 'dark'
              ? 'radial-gradient(120% 120% at 15% 10%, rgba(120,144,255,0.18), transparent 60%), radial-gradient(120% 120% at 85% 90%, rgba(0,200,170,0.12), transparent 65%)'
              : 'linear-gradient(135deg, rgba(33,150,243,0.14), rgba(0,188,212,0.08))',
          minHeight: '100%',
        })}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Stack spacing={{ xs: 5, md: 8 }}>
            <Stack spacing={1.5} alignItems="flex-start">
              <Typography variant="h3" component="h1">
                My Library
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
                Manage your collection, update cover art, and prepare copies for sale without leaving this page.
              </Typography>
            </Stack>
            <Grid2 container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
              <Grid2 xs={12} md={5}>
                <AddCopyForm />
              </Grid2>
              <Grid2 xs={12} md={7}>
                <Stack spacing={3} sx={{ height: '100%' }}>
                  <Typography variant="h6" component="h2">
                    Collection overview
                  </Typography>
                  <CopyGallery copies={copies} disableContainer />
                </Stack>
              </Grid2>
            </Grid2>
          </Stack>
        </Container>
      </Box>
    </>
  )
}

export default UserLibraryPage
