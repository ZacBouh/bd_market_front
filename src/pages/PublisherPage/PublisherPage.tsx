import { Typography } from '@mui/material';
import { FullSizeCentered } from '@/components/styled';
import PublisherForm from '@/components/Forms/PublisherForm/PublisherForm';

function PublisherPage() {
  return (
    <>
      <meta name="title" content="Page 3" />
      <FullSizeCentered>
        <Typography variant="h3">Add a Publisher</Typography>
        <PublisherForm/>
      </FullSizeCentered>
    </>
  );
}

export default PublisherPage;
