import { Container, TextField, Typography } from "@mui/material"
import debounce from "@/utils/debounce"
import { useEffect, useMemo, useState } from "react"
import { searchCopy } from "@/backend/api/copy"
import MarketGallery from "@/components/Gallery/MarketGallery/MarketGallery"

const MarketPage = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [copies, setCopies] = useState<CreatedCopy[]>([]) 
    const handleSearch = useMemo(() => debounce((text: string) =>{
        if(text.trim() === ''){
            setCopies([])
            return 
        }
        console.log(`searching : ${text}`)
        return searchCopy({query: text, forSale: true}, handleFoundCopies)
    }), []) 
    const handleFoundCopies = (copies : CreatedCopy[] | undefined) => {
        console.log("Found Copies for sale : ", copies)
        setCopies(copies ?? [])
    }
    useEffect(() => {
        return handleSearch(searchQuery)
    },[searchQuery])
    return <Container>
        <Typography variant="h1" >Market</Typography>
        <TextField 
            placeholder="search" 
            sx={{width: '100%'}} 
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            ></TextField>
        <MarketGallery copies={copies} />
    </Container>
}

export default MarketPage