import { Box, Stack, TextField } from "@mui/material"
import { useState } from "react"
import CurrencySelect from "../CurrencySelect/CurrencySelect"
import { NumericFormat, NumericFormatProps } from 'react-number-format'

type PriceInputSelectProps = {
    onChange?: (price: Price) => void
    label?: string 
    price?: Price
}



const PriceInputSelect = (props : PriceInputSelectProps) => {
    const initialState : Price = props.price ?? {amount: '', currency: 'euro'}
    const [price, setPrice]= useState<Price>(initialState)    
    const {onChange} = props
    const label = props.label ?? 'Price'
    return <Box>
        <Stack direction={'row'}>
            <NumericFormat customInput={TextField}
                autoComplete="off"
                value={price.amount}
                onValueChange={floatValue =>{
                    if(floatValue !== undefined){
                        const newPrice = {...price, amount: floatValue.value}
                        setPrice(newPrice)
                        onChange && onChange(newPrice)
                    }
                }}
                sx={{minWidth: '190px', width: 0}}
                slotProps={{input: {slotProps:{input:{sx:{textAlign: 'right'}, placeholder: label}}}}}
            />
            <CurrencySelect
                onChange={currency => {
                    const newPrice = {...price, currency: currency.value}
                    setPrice(newPrice)
                    onChange && onChange(newPrice)
                }}
                defaultValue={'euro'}
            />
        </Stack>
    </Box>
}

export default PriceInputSelect