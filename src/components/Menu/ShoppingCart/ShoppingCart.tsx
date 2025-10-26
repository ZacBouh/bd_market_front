import { Button, CardMedia, IconButton, Stack, Typography } from "@mui/material"
import ButtonMenu, { ButtonMenuItem } from "../ButtonMenu/ButtonMenu"
import CartIcon from "@mui/icons-material/ShoppingCart"
import { useAtom } from "jotai"
import { shoppingCartAtom } from "@/store/shoppingCart"
import { Fragment, useMemo } from "react"
import DeleteIcon from "@mui/icons-material/Delete"
import ClearIcon from "@mui/icons-material/HighlightOff"
import { useNavigate } from "react-router"
import { formatCurrencyAmount } from "@/utils/price"
import { getImageUrl } from "@/utils/image"

export type ShoppingCartProps = {
     
}

const ShoppingCart = () => { 
    const [{copies}, setCartState] = useAtom(shoppingCartAtom)
    const navigate = useNavigate()
    const handleCheckout = (closeMenu : () => void) => {
        closeMenu()
        navigate('/shopping-cart')
    } 
    const menuItems : ButtonMenuItem[] = useMemo(() => copies?.map(copy => ({
        label: <Stack direction={'row'} gap={2} padding={1}>
            <CardMedia
                component="img"
                image={getImageUrl(copy?.coverImage?.url)}
                alt={copy.title.name}
                sx={{
                    width: 48,
                    height: 64,
                    borderRadius: 1,
                    objectFit: 'cover',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'default'
                }}
            />
            <Stack direction={'column'} flex={1}>
                <Typography>{copy.title.name}</Typography>
                <Stack direction={"row"} display={'flex'} justifyContent={'space-between'} width={'100%'} mt={1}>
                    <Typography variant="caption" sx={{width: '100%'}} >
                        {formatCurrencyAmount(copy.price, copy.currency) ?? '-'}
                    </Typography>
                    <ClearIcon sx={{opacity: 0.3, "&:hover" : {opacity: 1, cursor: 'pointer'}}}
                        onClick={() => setCartState(state => ({...state, copies: state.copies.filter(item => item.id !== copy.id)}))}
                    />
                </Stack>
            </Stack>
        </Stack>
    })) ?? [{label: "Empty"}], [copies] )  
    return <ButtonMenu 
        ButtonElement={IconButton}
        buttonProps={{children: <CartIcon/>,  sx: {ml: 'auto', borderRadius: 2}}}
        anchorOrigin={{vertical: "bottom", horizontal: "left"}}
    >
        {({closeMenu}) => {
            return <Stack direction={"column"}>
                {menuItems.map((item, index )=> <Fragment key={index}>{item.label}</Fragment>)}
                {menuItems.length > 0 && 
                    <Stack direction={"row"}  display={"flex"} justifyContent={"space-between"} sx={{px: 1}}>
                        <Button onClick={closeMenu} ><DeleteIcon/></Button>
                        <Button onClick={() => handleCheckout(closeMenu)} >Go to Checkout</Button>
                    </Stack>
                }
                {menuItems.length === 0 && <Typography width={'200px'} textAlign={'center'}>Empty</Typography>}
            </Stack>
        }}
    </ButtonMenu>
}

export default ShoppingCart