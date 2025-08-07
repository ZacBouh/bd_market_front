import {  Container, Typography } from '@mui/material';

import { Centered } from '@/components/styled';
import AddCopyForm from '@/components/Forms/AddCopyForm/AddCopyForm';

function UserLibraryPage() {
  return (
    <>
      <meta name="title" content="Page 4" />
      <Container>
        <Centered>
          <Typography variant="h3">My Library</Typography>
          <AddCopyForm/>
        </Centered>
      </Container>
    </>
  );
}

export default UserLibraryPage;
