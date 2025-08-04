import { Box, Button,  MenuItem, Select, TextField, Typography } from '@mui/material';
import { newPublisherForm, initialState } from './atom';
import { useAtom } from 'jotai';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { usePublishers } from '@/hooks/usePublisher';
import { createPublisher } from '@/backend/api/publishers';
import type { NewPublisher } from '@/backend/api/publishers';

const PublisherForm = () => {
    const [publisherForm, setPublisherForm] = useAtom<NewPublisher>(newPublisherForm)
    const {publishersList, setPublishersList} = usePublishers()  
    const skills = ['France', 'USA', 'Japan', 'Italy', 'Belgium']
    console.log("Publishers",publishersList)
    
    return <Box component='form'  onSubmit={async (event) => {
            event.preventDefault()
            setPublishersList(publishersList => [...publishersList, publisherForm])
            console.log("Form submitted", publisherForm)
            const createdPublisher = await createPublisher(publisherForm)
            console.log(createdPublisher)
        }}
          sx={{width:'100%'}}
        >
            <TextField 
            label="Name"
            value={publisherForm.name}
            onChange={(event) => setPublisherForm((publisher) => ({...publisher, name: event.target.value}))}
            required
            fullWidth
            />
            <TextField 
            label="Description"
            value={publisherForm.description}
            onChange={(event) => setPublisherForm((publisher) => ({...publisher, description: event.target.value}))}
            fullWidth
            />
            <DatePicker 
            label="Creation Date"
            value={publisherForm.birthDate ? dayjs(publisherForm.birthDate) : null}
            onChange={(newDate) => setPublisherForm((publisher) => ({...publisher, birthDate: dayjs(newDate).startOf('day').format('YYYY-MM-DD')}))}
            />
            <DatePicker 
            label="Death Date"
            value={publisherForm.deathDate ? dayjs(publisherForm.deathDate) : null}
            onChange={(newDate) => setPublisherForm((publisher) => ({...publisher, deathDate: dayjs(newDate).startOf('day').format('YYYY-MM-DD')}))}
            />
            {/* <Select
                displayEmpty
                value={publisherForm.country}
                onChange={(event) => setPublisherForm(publisher => ({...publisher, country: event?.target.value})) }
                renderValue={(selected) => {
                console.log("selected : ", selected)
                if(selected.length === 0){
                return <Typography sx={{color: 'text.secondary'}} >Select Country</Typography>
                } 
                return <Typography sx={{color: 'text.secondary'}} >{selected}</Typography>
                }}
            >
                <MenuItem value=""><Typography sx={{color: 'text.secondary'}} >-</Typography></MenuItem>
                    {skills.map(skill => <MenuItem
                    key={skill}
                    value={skill}
                >
                    {skill}
                </MenuItem>)}
            </Select> */}
            <Box sx={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: 1}} >
            <Button onClick={() => setPublisherForm(initialState)} >Reset</Button>
            <Button type='submit' >Ajouter</Button>
            </Box>
        </Box>
}

export default PublisherForm