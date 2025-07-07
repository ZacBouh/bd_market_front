import { Button, Drawer, List, ListItem, useTheme } from "@mui/material";
import { useSidebar } from "./hooks";

export default function SideMenu(){
    const {isOpen, close: closeMenu} = useSidebar()
    const theme = useTheme()
    console.log(isOpen)
    return <Drawer
    variant="persistent"
    open={isOpen}
    sx={{"& .MuiDrawer-paper ": { boxSizing: 'border-box', width: theme.custom.sideMenuWidth, backgroundColor: 'background.default'}}}
  >
    <List>
      <ListItem>
        Item 1 
      </ListItem>
      <ListItem>
        Item 2 
      </ListItem>
      <Button
        onClick={closeMenu}
      >
        Close
      </Button>
    </List>
  </Drawer>
}