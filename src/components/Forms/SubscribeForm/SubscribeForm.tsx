import { Box, Button,  TextField } from '@mui/material';
import { useState } from 'react';

const SubscribeForm = () => {
    const initialState = {
        email: '',
        pseudo: '',
        password: ''
    }
    const [subscribeForm, setSubscribeForm] = useState(initialState)
    
    return <Box component='form'  onSubmit={(event) => {
            event.preventDefault()
            console.log("Form submitted", subscribeForm) 
        }}
          sx={{width:'100%'}}
        >
            <TextField 
            label="email"
            value={subscribeForm.email}
            onChange={(event) => setSubscribeForm((subscribeForm) => ({...subscribeForm, email: event.target.value}))}
            required
            fullWidth
            />
            <TextField 
            label="pseudo"
            value={subscribeForm.pseudo}
            onChange={(event) => setSubscribeForm((subscribeForm) => ({...subscribeForm, pseudo: event.target.value}))}
            required
            fullWidth
            />
            <TextField 
            label="password"
            value={subscribeForm.password}
            onChange={(event) => setSubscribeForm((subscribeForm) => ({...subscribeForm, password: event.target.value}))}
            required
            fullWidth
            />
            <Box sx={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: 1}} >
                <Button onClick={() => setSubscribeForm(initialState)} >Reset</Button>
                <Button type='submit' >Ajouter</Button>
            </Box>
        </Box>
}

export default SubscribeForm