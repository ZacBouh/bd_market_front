import { Box, Button,  TextField } from '@mui/material';
import { loginUser } from '@/backend/api/auth';
import { useNotifications } from '@toolpad/core/useNotifications';
import { zodResolver } from "@hookform/resolvers/zod"
import {  z } from "zod"
import {useForm} from "react-hook-form"

const schema = z.object({
    email: z.email({error: " "}).nonempty("An email is required"),
    password: z.string()
        .nonempty(" ")
        .min(8, "Min 8 characters")
        .regex(/[A-Z]/, {error: "One uppercase"})
        .regex(/[a-z]/, {error: "One lowercase"})
        .regex(/\d/, "One number")
        .regex(/^\S+$/, {error: "No space allowed"})
        .regex(/[^A-Za-z0-9\s\/\\"'{}()<>|;:]/, {error: "One special character"})
})

export type LoginFormData = z.infer<typeof schema>

const LoginForm = () => {
    const {handleSubmit, register, formState : {errors}, reset} = useForm({
        resolver: zodResolver(schema),
        defaultValues: { email: '', password: '' },
        mode: 'onChange'
    })
    const notifications = useNotifications()
    const onSubmit = async (data: LoginFormData) => {
        notifications.show(<h1>"Form submitted"</h1>, {autoHideDuration: 5000})
        const loginResponse = await loginUser(data)
        notifications.show(<h2>Login Response {loginResponse?.user.email}</h2>, {autoHideDuration: 5000})
    }
    console.log(Object.keys(errors))
    return <Box component='form'  onSubmit={handleSubmit(onSubmit, () => notifications.show("Invalid Credentials", {severity: 'error', autoHideDuration: 2500}))}
          sx={{
            width:'100%',
        }}
        >
            <TextField 
            label="email"
            {...register('email')}
            // required
            fullWidth
            // helperText={errors.email?.message}
            />
            <TextField 
            label="password"
            {...register('password')}
            // required
            fullWidth
            // helperText={errors.password?.message}
            />
            <Box sx={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: 1}} >
                <Button onClick={() => reset()} >Reset</Button>
                <Button type='submit' sx={{
                    position: 'relative',
                    zIndex: 9999,
                    pointerEvents: 'auto'
                }} >Ajouter</Button>
            </Box>
        </Box>
}

export default LoginForm