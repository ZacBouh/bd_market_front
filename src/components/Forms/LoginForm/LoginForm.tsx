import { Box, Button,  TextField } from '@mui/material';
import { useState } from 'react';
import { loginUser } from '@/backend/api/auth';

const LoginForm = () => {
    const initialState = {
        email: '',
        password: ''
    }
    const [loginForm, setLoginForm] = useState(initialState)
    
    return <Box component='form'  onSubmit={async (event) => {
            event.preventDefault()
            console.log("Form submitted", loginForm)
            const loginResponse = await loginUser(loginForm)
            console.log(loginResponse)
        }}
          sx={{width:'100%'}}
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
                <Button type='submit' >Ajouter</Button>
            </Box>
        </Box>
}

export default LoginForm