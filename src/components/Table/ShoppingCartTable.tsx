import { pay } from "@/backend/api/payment"
import { shoppingCartAtom } from "@/store/shoppingCart"
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useAtom } from "jotai"

const ShoppingCartTable = () => {
    const [{copies}, setCartSate] = useAtom(shoppingCartAtom)
    const totalPrice = copies.reduce((total, copy) => total + Number(copy?.price), 0)
    const currency = 'eur'
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
                       <Button onClick={() => setCartSate(state => ({...state, copies : []}))} >Empty Cart</Button> 
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {copies.map(copy => (
                    <TableRow key={copy.id}>
                        <TableCell>{copy.title.name}</TableCell>
                        <TableCell>{copy.price} {copy.currency}</TableCell>
                        <TableCell sx={{border: 'none', display: "flex", justifyContent: "center"}} >
                            <Button onClick={() => setCartSate(state => ({...state, copies: state.copies.filter(item => item.id !== copy.id)}))} >Remove</Button>
                        </TableCell>
                    </TableRow>
                ))}
                <TableRow >
                    <TableCell sx={{textAlign: 'right', border: 'none'}} >
                        Total
                    </TableCell>
                    <TableCell>{totalPrice} {currency}</TableCell>
                    <TableCell sx={{width: 0, whiteSpace: 'nowrap', textAlign: "center"}} >
                        <Button onClick={ () => pay()}>Pay</Button>
                    </TableCell>
                </TableRow >
            </TableBody>
        </Table>
    </TableContainer>
}

export default ShoppingCartTable