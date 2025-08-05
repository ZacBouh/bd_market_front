import { Button, Typography } from '@mui/material';
import { FullSizeCentered } from '@/components/styled';
import LoginForm from '@/components/Forms/LoginForm/LoginForm';
import { getGoogleOAuthOpenIdUrl } from '@/backend/api/auth';

function LoginPage() {

  const handleGoogleLogin = async () => {
    const authUrl = await getGoogleOAuthOpenIdUrl()
    console.log("google login generated url : ", authUrl)
    window.location.href = authUrl
  }

  return (
    <>
      <meta name="title" content="Page 3" />
      <FullSizeCentered>
        <Typography variant="h3">Login</Typography>
        <LoginForm/>
        <Button onClick={handleGoogleLogin}>Login with google</Button>
      </FullSizeCentered>
    </>
  );
}

export default LoginPage;
