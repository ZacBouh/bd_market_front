import { Menu, MenuItem, MenuProps } from "@mui/material"
import Box from "@mui/material/Box"
import React, { ComponentPropsWithRef, ReactNode, useState } from "react"

type ButtonMenuProps<ButtonEl extends React.ComponentType<any>> = {
    ButtonElement: ButtonEl
    buttonProps : Omit<ComponentPropsWithRef<ButtonEl>, 'onClick'>
    menuItems?: ButtonMenuItem[]
    anchorOrigin ?: MenuProps['anchorOrigin']
    tranformOrigin? : MenuProps['transformOrigin']
    children?: ReactNode | ((context : {closeMenu : () => void}) => ReactNode)
}

export type ButtonMenuItem = {
    label: ReactNode, 
    handleClick?: (...args : any) => any
    clickShouldClose?: boolean
}

const ButtonMenu = <ButtonEl extends React.ComponentType<any>>(props : ButtonMenuProps<ButtonEl>) => {
    const {ButtonElement, buttonProps, menuItems} = props
    const [anchorElement, setAnchorElement] = useState<null|HTMLElement>(null)
    const open = Boolean(anchorElement)
    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElement(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorElement(null)
    }
    const children = typeof props.children === 'function' ? props.children({closeMenu: handleClose}) : props.children
    return <Box>
        {React.createElement(ButtonElement, {
            key: (ButtonElement as any)?.muiName ?? ButtonElement?.name ?? 'btn',
            ...buttonProps,
            onClick: handleOpen
        })}
        <Menu
            open={open}
            onClose={handleClose}
            anchorEl={anchorElement}
            anchorOrigin={props.anchorOrigin ?? {vertical: 'top', horizontal: 'left'}}
            transformOrigin={props.tranformOrigin ?? {vertical:'bottom', horizontal: 'left'}}
        >
            {menuItems?.map((item, index)=> <MenuItem 
                    key={index} 
                    onClick={() => {
                        item.handleClick && item.handleClick()
                        !(item.clickShouldClose === false) && handleClose()
                    }}
                >
                {item.label}
            </MenuItem>)}
            {children}
        </Menu>
    </Box>
}

export default ButtonMenu