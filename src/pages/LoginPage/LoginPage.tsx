import { Button, Container, Typography } from '@mui/material';
import LoginForm from '@/components/Forms/LoginForm/LoginForm';
import { getGoogleOAuthOpenIdUrl } from '@/backend/api/auth';

function LoginPage() {
  const email = (new URLSearchParams(window.location.search)).get('email') ?? undefined
  const handleGoogleLogin = async () => {
    const authUrl = await getGoogleOAuthOpenIdUrl()
    console.log("google login generated url : ", authUrl)
    window.location.href = authUrl
  }

  return (
    <>
      <Container>
        <Typography variant="h3">Login</Typography>
        <LoginForm email={email} />
        <Button onClick={handleGoogleLogin}>Login with google</Button>
      </Container>
    </>
  );
}

export default LoginPage;
