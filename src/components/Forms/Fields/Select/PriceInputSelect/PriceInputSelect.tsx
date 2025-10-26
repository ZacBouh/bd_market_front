import { Box, Stack, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { NumericFormat } from "react-number-format"

import CurrencySelect from "../CurrencySelect/CurrencySelect"

type PriceInputSelectProps = {
    onChange?: (price: Price) => void
    label?: string
    price?: Price
}

const PriceInputSelect = (props: PriceInputSelectProps) => {
    const initialState: Price = props.price ?? { amount: "", currency: "euro" }
    const [price, setPrice] = useState<Price>(initialState)

    useEffect(() => {
        setPrice(props.price ?? { amount: "", currency: "euro" })
    }, [props.price])

    const { onChange } = props
    const label = props.label ?? "Price"

    return (
        <Box sx={{ width: 1 }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "stretch", sm: "center" }}
                sx={{ width: 1 }}
            >
                <NumericFormat
                    customInput={TextField}
                    autoComplete="off"
                    value={price.amount}
                    onValueChange={(values) => {
                        if (values !== undefined) {
                            const newPrice = { ...price, amount: values.value }
                            setPrice(newPrice)
                            onChange && onChange(newPrice)
                        }
                    }}
                    sx={{ flexGrow: 1, width: { xs: 1, sm: "auto" } }}
                    slotProps={{ input: { slotProps: { input: { sx: { textAlign: "right" }, placeholder: label } } } }}
                />
                <CurrencySelect
                    onChange={(currency) => {
                        const newPrice = { ...price, currency: currency.value }
                        setPrice(newPrice)
                        onChange && onChange(newPrice)
                    }}
                    defaultValue="euro"
                    fullWidth
                    sx={{ width: { xs: 1, sm: "auto" }, minWidth: { sm: "110px" } }}
                />
            </Stack>
        </Box>
    )
}

export default PriceInputSelect
