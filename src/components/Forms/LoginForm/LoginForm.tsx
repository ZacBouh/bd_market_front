import { TextField } from '@mui/material';
import { loginUser } from '@/backend/api/auth';
import { useNotifications } from '@toolpad/core/useNotifications';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {useForm} from "react-hook-form"
import FormLayout from '../FormLayout/FormLayout'
import FormSubmitAndResetButtons from '../Buttons/FormSubmitAndResetButtons'

const schema = z.object({
    email: z.email({error: "Required"}).nonempty("An email is required"),
    password: z.string()
        .nonempty("Required")
        .min(8, "Min 8 characters")
        .regex(/[A-Z]/, {error: "One uppercase"})
        .regex(/[a-z]/, {error: "One lowercase"})
        .regex(/\d/, "One number")
        .regex(/^\S+$/, {error: "No space allowed"})
        .regex(/[^A-Za-z0-9\s\/\\"'{}()<>|;:]/, {error: "One special character"})
})

export type LoginFormData = z.infer<typeof schema>
const env = import.meta.env.VITE_ENV
const LoginForm = ({email} : {email?:string}) => {
    const {handleSubmit, register, formState : {errors}, reset, watch} = useForm({
        resolver: zodResolver(schema),
        defaultValues: { email: email ?? '', password: '' },
        mode: 'onChange'
    })
    const notifications = useNotifications()
    const onSubmit = async (data: LoginFormData) => {
        loginUser(data, ({user}) => {
            notifications.show(`Successfully Logged In as ${user.pseudo}`, {
                autoHideDuration: 2000,
                severity: 'success'
            })
        })
    }
    env === 'dev' && console.log("Errors on fields: ",Object.keys(errors))
    const values = watch()
    return <FormLayout  onSubmit={handleSubmit(onSubmit, () => notifications.show("Invalid Credentials", {severity: 'error', autoHideDuration: 2500}))}
          >
            <TextField
            label="email"
            {...register('email')}
            required
            error={!!errors.email}
            helperText={errors.email?.message}
            />
            <TextField
            label="password"
            type={env === 'dev' ? 'text' : 'password'}
            {...register('password')}
            required
            error={!!errors.password}
            helperText={errors.password?.message}
            />
            <FormSubmitAndResetButtons
                state={values}
                handleReset={() => reset()}
                submitLabel="Se connecter"
            />
        </FormLayout>
}

export default LoginForm
