import {  Container, Typography } from '@mui/material';

import { Centered } from '@/components/styled';
import AddCopyForm from '@/components/Forms/AddCopyForm/AddCopyForm';
import CopyGallery from '@/components/Gallery/CopyGallery/CopyGallery';
import { useEffect, useState } from 'react';
import { getCopies } from '@/backend/api/copy';

function UserLibraryPage() {
  const [copies, setCopies] = useState<CreatedCopy[]>([])
  useEffect(() => {
    return getCopies((copies) => setCopies(copies))
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
