import { useCallback, useMemo, useState } from "react"
import { UnavailableCopiesError, pay } from "@/backend/api/payment"
import { shoppingCartAtom } from "@/store/shoppingCart"
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useAtom } from "jotai"
import { notification } from "@/utils/padNotification"

const ShoppingCartTable = () => {
    const [{copies}, setCartSate] = useAtom(shoppingCartAtom)
    const [isBusy, setIsBusy] = useState(false)

    const totalPrice = useMemo(() => copies.reduce((total, copy) => total + Number(copy?.price), 0), [copies])
    const currency = "eur"

    const handlePay = useCallback(async () => {
        if (isBusy) {
            return
        }

        const requestId = crypto.randomUUID()

        try {
            setIsBusy(true)
            await pay({requestId})
        } catch (error) {
            let message: string

            if (error instanceof UnavailableCopiesError) {
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
                       <Button onClick={() => setCartSate(state => ({...state, copies : []}))} disabled={isBusy}>Empty Cart</Button>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {copies.map(copy => (
                    <TableRow key={copy.id}>
                        <TableCell>{copy.title.name}</TableCell>
                        <TableCell>{copy.price} {copy.currency}</TableCell>
                        <TableCell sx={{border: 'none', display: "flex", justifyContent: "center"}} >
                            <Button onClick={() => setCartSate(state => ({...state, copies: state.copies.filter(item => item.id !== copy.id)}))} disabled={isBusy}>Remove</Button>
                        </TableCell>
                    </TableRow>
                ))}
                <TableRow >
                    <TableCell sx={{textAlign: 'right', border: 'none'}} >
                        Total
                    </TableCell>
                    <TableCell>{totalPrice} {currency}</TableCell>
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
