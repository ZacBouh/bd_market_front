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
                    sx={{ flex: { xs: "none", sm: 1 }, flexBasis: { sm: 0 }, width: { xs: 1, sm: "auto" }, minWidth: 0 }}
                    slotProps={{ input: { slotProps: { input: { sx: { textAlign: "right" }, placeholder: label } } } }}
                />
                <CurrencySelect
                    onChange={(currency) => {
                        const newPrice = { ...price, currency: currency.value }
                        setPrice(newPrice)
                        onChange && onChange(newPrice)
                    }}
                    defaultValue="euro"
                    sx={{
                        width: { xs: 1, sm: "auto" },
                        minWidth: { sm: "calc(1ch + 32px)" },
                        flex: { xs: "1 1 auto", sm: "0 0 auto" },
                        flexShrink: { sm: 0 },
                        alignSelf: { xs: "stretch", sm: "flex-start" },
                        "& .MuiInputBase-root": {
                            width: { xs: 1, sm: "auto" },
                            minWidth: 0,
                        },
                        "& .MuiSelect-select": {
                            px: 1,
                            display: "flex",
                            justifyContent: "center",
                            minWidth: 0,
                        },
                    }}
                />
            </Stack>
        </Box>
    )
}

export default PriceInputSelect
