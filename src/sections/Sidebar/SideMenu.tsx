import { Button, Drawer,  List, ListItem, ListItemButton, useTheme } from "@mui/material";
import { useSidebar } from "./hooks";
import { Link } from "react-router";
import routes from "@/routes";

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
        {routes.map(route => <ListItem key={route.id}>
          <Link to={route.path} >
          {/* <ListItemButton component={Link} > */}
            
          {route.icon ? <route.icon/> : null}
          {route.title} 
          {/* </ListItemButton> */}
          </Link>
        </ListItem>
        )}
      
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