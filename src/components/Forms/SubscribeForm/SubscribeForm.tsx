import { Box, Button,  TextField } from '@mui/material';
import { registerUser } from '@/backend/api/auth';
import {z} from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNotifications } from '@toolpad/core/useNotifications';
import { useNavigate } from 'react-router';

export const subscribeFormSchema = z.object({
    email: z.email({error: "Invalid email"}),
    password: z.string()
        .nonempty("Required")
        .min(8, "Min 8 characters")
        .regex(/[A-Z]/, {error: "One uppercase"})
        .regex(/[a-z]/, {error: "One lowercase"})
        .regex(/\d/, "One number")
        .regex(/^\S+$/, {error: "No space allowed"})
        .regex(/[^A-Za-z0-9\s\/\\"'{}()<>|;:]/, {error: "One special character"}),
    pseudo: z.string()
        .nonempty("Required")
        .min(3, "Min 3 characters")
}) 

type SubscribeFormData = z.infer<typeof subscribeFormSchema>
const env = import.meta.env.VITE_ENV

const SubscribeForm = () => {
    const notifications = useNotifications()
    const navigate = useNavigate()
    const {handleSubmit, register, formState: {errors}, reset} = useForm({
        resolver: zodResolver(subscribeFormSchema),
        defaultValues: { email: '', password: '', pseudo: '' },
        mode: 'onChange'
    })
    const onSubmit = (data : SubscribeFormData) => {
            env === 'dev' && console.log("Form submitted", data)
            registerUser(data, (user) => {
                const successNotification = notifications.show(`Successfully created account for ${user.email}`, {
                    actionText: 'Login',
                    onAction: () =>{
                        notifications.close(successNotification)
                        navigate(`/login?email=${user.email}`)
                    },
                    severity: 'success'
                })
            })
    }
    return <Box component='form'  onSubmit={handleSubmit(onSubmit)}
          sx={{width:'100%'}}
        >
            <TextField 
            label="email"
            {...register('email')}
            required
            fullWidth
            error={!!errors?.email}
            helperText={errors.email?.message}
            />
            <TextField 
            label="pseudo"
            {...register('pseudo')}
            required
            fullWidth
            error={!!errors?.pseudo}
            helperText={errors?.pseudo?.message}
            />
            <TextField 
            label="password"
            type={env === 'dev' ? 'text' : 'password'}
            {...register('password')}
            required
            fullWidth
            error={!!errors?.password}
            helperText={errors.password?.message}
            />
            <Box sx={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: 1}} >
                <Button onClick={() => reset()} >Reset</Button>
                <Button type='submit' >Ajouter</Button>
            </Box>
        </Box>
}

export default SubscribeForm