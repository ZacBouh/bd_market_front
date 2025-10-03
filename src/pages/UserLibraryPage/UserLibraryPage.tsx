import {  Container, Typography } from '@mui/material';

import { Centered } from '@/components/styled';
import AddCopyForm from '@/components/Forms/AddCopyForm/AddCopyForm';
import CopyGallery from '@/components/Gallery/CopyGallery/CopyGallery';
import { useEffect } from 'react';
import { getCopies } from '@/backend/api/copy';
import { useCopy } from '@/hooks/useCopy';

function UserLibraryPage() {
  const {copies} = useCopy()
  useEffect(() => {
    return getCopies()
  }, [])
  
  return (
    <>
      <meta name="title" content="Page 4" />
      <Container>
        <Centered>
          <Typography variant="h3">My Library</Typography>
          <AddCopyForm/>
          <CopyGallery copies={copies} />
        </Centered>
      </Container>
    </>
  );
}

export default UserLibraryPage;
