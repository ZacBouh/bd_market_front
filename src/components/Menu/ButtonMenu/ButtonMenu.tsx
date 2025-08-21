import { Button, Menu, MenuItem } from "@mui/material"
import Box from "@mui/material/Box"
import React, { ComponentPropsWithRef, PropsWithChildren, ReactNode, useState } from "react"

type ButtonMenuProps<ButtonEl extends React.ComponentType<any>> = {
    ButtonElement: ButtonEl
    buttonProps : Omit<ComponentPropsWithRef<ButtonEl>, 'onClick'>
    menuItems : ButtonMenuItem[]
}

type ButtonMenuItem = {
    label: string, 
    handleClick?: (...args : any) => any
    clickShouldClose?: boolean
}

const ButtonMenu = <ButtonEl extends React.ComponentType<any>>(props : ButtonMenuProps<ButtonEl>) => {
    const {ButtonElement, buttonProps, menuItems} = props
    const [anchorElement, setAnchorElement] = useState<null|HTMLElement>(null)
    const open = Boolean(anchorElement)
    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        console.log(event.currentTarget)
        setAnchorElement(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorElement(null)
    }

    return <Box>
        {React.createElement(ButtonElement, {
            ...buttonProps,
            onClick: handleOpen
        })}
        <Menu
            open={open}
            onClose={handleClose}
            anchorEl={anchorElement}
            anchorOrigin={{vertical: 'top', horizontal: 'left'}}
            transformOrigin={{vertical:'bottom', horizontal: 'left'}}
        >
            {menuItems.map(item => <MenuItem 
                    key={item.label} 
                    onClick={() => {
                        item.handleClick && item.handleClick()
                        !(item.clickShouldClose === false) && handleClose()
                    }}
                >
                {item.label}
            </MenuItem>)}
        </Menu>
    </Box>
}

export default ButtonMenu