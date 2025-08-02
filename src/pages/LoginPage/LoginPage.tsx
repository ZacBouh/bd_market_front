import { Typography } from '@mui/material';
import { FullSizeCentered } from '@/components/styled';
import LoginForm from '@/components/Forms/LoginForm/LoginForm';
function LoginPage() {
  return (
    <>
      <meta name="title" content="Page 3" />
      <FullSizeCentered>
        <Typography variant="h3">Login</Typography>
        <LoginForm/>
      </FullSizeCentered>
    </>
  );
}

export default LoginPage;
