import { Button, Drawer,  List, ListItem, ListItemButton, useTheme } from "@mui/material";
import { useSidebar } from "./hooks";
import { Link } from "react-router";
import routes from "@/routes";
import { renderRoutes } from "@/routes/Pages/utils";

export default function SideMenu(){
    const {isOpen, close: closeMenu} = useSidebar()
    const theme = useTheme()
    return <Drawer
    variant="persistent"
    open={isOpen}
    sx={{"& .MuiDrawer-paper ": { boxSizing: 'border-box', width: theme.custom.sideMenuWidth, backgroundColor: 'background.default'}}}
  >
    <List>
        {routes.map(route => <ListItem key={route.path}>
          <ListItemButton component={Link} to={route.path ? route.path : "/404"}>
            {route.icon ? <route.icon/> : null}
            {route.title} 
          </ListItemButton>
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