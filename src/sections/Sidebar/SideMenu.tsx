import { Button, Drawer,  List, ListItem, ListItemButton, useMediaQuery, useTheme } from "@mui/material";
import { useSidebar } from "./hooks";
import { useNavigate } from "react-router";
import routes from "@/routes";
import BugReportIcon from '@mui/icons-material/BugReport';
import { useUser } from "@/hooks/useUser";
import { Fragment } from "react/jsx-runtime";

export default function SideMenu(){

    const {isOpen, close: closeMenu} = useSidebar()
    const navigate = useNavigate()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const {user, logout} = useUser()
    const handleMenuItemClick = (path: string) => {
      navigate(path)
      isMobile && closeMenu()
    }
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
                <ListItemButton onClick={() => handleMenuItemClick(route.path ?? '/404')}>
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