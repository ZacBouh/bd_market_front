import { Button, Container, Stack } from '@mui/material';

import { getGoogleOAuthOpenIdUrl } from '@/backend/api/auth';
import LoginForm from '@/components/Forms/LoginForm/LoginForm';
import PageHero from '@/components/PageHero';

function LoginPage() {
  const email = new URLSearchParams(window.location.search).get('email') ?? undefined;
  const handleGoogleLogin = async () => {
    const authUrl = await getGoogleOAuthOpenIdUrl();
    console.log('google login generated url : ', authUrl);
    window.location.href = authUrl;
  };

  return (
    <>
      <meta name="title" content="Login" />
      <Container maxWidth="sm" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={{ xs: 4, md: 5 }} alignItems="center">
          <PageHero
            title="Login"
            description="Access your BD Market account to manage your collection, purchases, and listings."
            align="center"
          />
          <LoginForm email={email} />
          <Button onClick={handleGoogleLogin} variant="outlined">
            Continue with Google
          </Button>
        </Stack>
      </Container>
    </>
  );
}

export default LoginPage;
