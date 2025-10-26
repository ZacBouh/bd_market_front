import { useCallback, useMemo, useState } from "react"
import { UnavailableCopiesError, pay } from "@/backend/api/payment"
import { shoppingCartAtom } from "@/store/shoppingCart"
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useAtom } from "jotai"
import { notification } from "@/utils/padNotification"
import { convertPriceToApi, formatCurrencyAmount, formatCurrencyFromCents } from "@/utils/price"

const ShoppingCartTable = () => {
    const [{copies}, setCartState] = useAtom(shoppingCartAtom)
    const [isBusy, setIsBusy] = useState(false)
    const [unavailableCopyIds, setUnavailableCopyIds] = useState<number[]>([])

    const totalPriceInCents = useMemo(
        () => copies.reduce((total, copy) => total + (convertPriceToApi(copy?.price) ?? 0), 0),
        [copies]
    )
    const currency = copies[0]?.currency

    const handleRemove = useCallback((copyId: number) => {
        setCartState(state => ({...state, copies: state.copies.filter(item => item.id !== copyId)}))
        setUnavailableCopyIds(ids => ids.filter(id => id !== copyId))
    }, [setCartState])

    const handleEmptyCart = useCallback(() => {
        setCartState(state => ({...state, copies: []}))
        setUnavailableCopyIds([])
    }, [setCartState])

    const handlePay = useCallback(async () => {
        if (isBusy) {
            return
        }

        const requestId = crypto.randomUUID()

        try {
            setUnavailableCopyIds([])
            setIsBusy(true)
            await pay({requestId})
        } catch (error) {
            let message: string

            if (error instanceof UnavailableCopiesError) {
                setUnavailableCopyIds(error.copyIds)
                message = error.message
            } else if (error instanceof Error) {
                message = `Payment failed: ${error.message}`
            } else {
                message = "Payment failed: Unable to process payment"
            }

            notification.show(message, {severity: "error", autoHideDuration: 4000})
            setIsBusy(false)
        }
    }, [isBusy])

    return <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>
                       Name
                    </TableCell>
                    <TableCell>
                       Price
                    </TableCell>
                    <TableCell sx={{whiteSpace: 'nowrap'}}>
                       <Button onClick={handleEmptyCart} disabled={isBusy}>Empty Cart</Button>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {copies.map(copy => {
                    const isUnavailable = unavailableCopyIds.includes(copy.id)

                    return (
                        <TableRow key={copy.id}>
                            <TableCell sx={isUnavailable ? {textDecoration: "line-through", color: "text.secondary"} : undefined}>
                                {copy.title.name}
                            </TableCell>
                            <TableCell sx={isUnavailable ? {textDecoration: "line-through", color: "text.secondary"} : undefined}>
                                {formatCurrencyAmount(copy.price, copy.currency) ?? '-'}
                            </TableCell>
                            <TableCell sx={{border: 'none', display: "flex", justifyContent: "center"}} >
                                <Button onClick={() => handleRemove(copy.id)} disabled={isBusy}>Remove</Button>
                            </TableCell>
                        </TableRow>
                    )
                })}
                <TableRow >
                    <TableCell sx={{textAlign: 'right', border: 'none'}} >
                        Total
                    </TableCell>
                    <TableCell>{formatCurrencyFromCents(totalPriceInCents, currency)}</TableCell>
                    <TableCell sx={{width: 0, whiteSpace: 'nowrap', textAlign: "center"}} >
                        <Button onClick={handlePay} disabled={isBusy}>
                            {isBusy ? "Redirecting…" : "Pay"}
                        </Button>
                    </TableCell>
                </TableRow >
            </TableBody>
        </Table>
    </TableContainer>
}

export default ShoppingCartTable
