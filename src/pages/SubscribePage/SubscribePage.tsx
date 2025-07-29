import { Typography } from '@mui/material';
import { FullSizeCentered } from '@/components/styled';
import SubscribeForm from '@/components/Forms/SubscribeForm/SubscribeForm';

function SubscribePage() {
  return (
    <>
      <meta name="title" content="Page 3" />
      <FullSizeCentered>
        <Typography variant="h3">Subscribe</Typography>
        <SubscribeForm/>
      </FullSizeCentered>
    </>
  );
}

export default SubscribePage;
