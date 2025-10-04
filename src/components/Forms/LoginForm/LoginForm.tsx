import { Box, Button,  TextField } from '@mui/material';
import { useState } from 'react';
import { loginUser } from '@/backend/api/auth';
import { useNotifications } from '@toolpad/core/useNotifications';

const LoginForm = () => {
    const initialState = {
        email: '',
        password: ''
    }
    const [loginForm, setLoginForm] = useState(initialState)
    const notifications = useNotifications()
    return <Box component='form'  onSubmit={async (event) => {
            event.preventDefault()
            notifications.show("Form submitted")
            const loginResponse = await loginUser(loginForm)
            notifications.show(`Log In response : ${loginResponse.user.email}`)
        }}
          sx={{
            width:'100%',

        }}
        >
            <TextField 
            label="email"
            value={loginForm.email}
            onChange={(event) => setLoginForm((loginForm) => ({...loginForm, email: event.target.value}))}
            required
            fullWidth
            />
            <TextField 
            label="password"
            value={loginForm.password}
            onChange={(event) => setLoginForm((loginForm) => ({...loginForm, password: event.target.value}))}
            required
            fullWidth
            />
            <Box sx={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: 1}} >
                <Button onClick={() => setLoginForm(initialState)} >Reset</Button>
                <Button type='submit' sx={{
                    position: 'relative',
                    zIndex: 9999,
                    pointerEvents: 'auto'
                }} >Ajouter</Button>
            </Box>
        </Box>
}

export default LoginForm