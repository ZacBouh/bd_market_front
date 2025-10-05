import { Button, Drawer,  List, ListItem, ListItemButton, useTheme } from "@mui/material";
import { useSidebar } from "./hooks";
import { Link } from "react-router";
import routes from "@/routes";
import BugReportIcon from '@mui/icons-material/BugReport';
import { useUser } from "@/hooks/useUser";
import { Fragment } from "react/jsx-runtime";

export default function SideMenu(){

    const {isOpen} = useSidebar()
    const theme = useTheme()
    const {user, logout} = useUser()
    return <Drawer
    variant="persistent"
    open={isOpen}
    sx={{"& .MuiDrawer-paper ": { boxSizing: 'border-box', width: theme.custom.sideMenuWidth, backgroundColor: 'background.default'}}}
  >
    <List>
        {routes.map(route => (
          <Fragment key={route.path}>
            {(user || !route.isProtected) && route.title && 
              <ListItem >
                <ListItemButton component={Link} to={route.path ? route.path : "/404"}>
                  {route.icon ? <route.icon/> : null}
                  {route.title} 
                </ListItemButton>
              </ListItem>
            }
          </Fragment>
          ))}
        {user && 
          <ListItem key={'logout'} >
            <ListItemButton component={Button} onClick={logout} >
              <BugReportIcon/>
              Logout 
            </ListItemButton>
          </ListItem>
        }
    </List>
  </Drawer>
}