import { Box, Button,  MenuItem, Select, TextField, Typography } from '@mui/material';
import { newPublisherForm, initialState } from './atom';
import { useAtom } from 'jotai';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { usePublishers } from '@/hooks/usePublisher';

const PublisherForm = () => {
    const [publisherForm, setPublisherForm] = useAtom(newPublisherForm)
    const {publishersList, setPublishersList} = usePublishers()  
    const skills = ['France', 'USA', 'Japan', 'Italy', 'Belgium']
    console.log("Publishers",publishersList)
    
    return <Box component='form'  onSubmit={(event) => {
            event.preventDefault()
            setPublishersList(publishersList => [...publishersList, publisherForm])
            console.log("Form submitted", publisherForm) 
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
            <DatePicker 
            label="Creation Date"
            value={publisherForm.creationDate ? dayjs(publisherForm.creationDate) : null}
            onChange={(newDate) => setPublisherForm((publisher) => ({...publisher, creationDate: dayjs(newDate).startOf('day').format('YYYY-MM-DD')}))}
            />
            <Select
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
            </Select>
            <Box sx={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: 1}} >
            <Button onClick={() => setPublisherForm(initialState)} >Reset</Button>
            <Button type='submit' >Ajouter</Button>
            </Box>
        </Box>
}

export default PublisherForm