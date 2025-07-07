import { Link } from 'react-router';

import DefaultIcon from '@mui/icons-material/Deblur';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from '@mui/material';

import routes from '@/routes';

import { useSidebar } from './hooks';

function Sidebar() {
  const { isOpen, open, close } = useSidebar();

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={close}
      onOpen={open}
      disableBackdropTransition={false}
      // swipeAreaWidth={30}
      data-pw="sidebar"
      variant='persistent'
      // elevation={2}
      sx={{"& .MuiList-root": {
        padding: 0,
      } }}
    >
      <List sx={{ width: 250, pt: (theme) => `${theme.mixins.toolbar.minHeight}px` }}>
        <ListItem>

        </ListItem>
        {routes
          .filter((route) => route.title)
          .map(({ path, title, icon: Icon }) => (
            <ListItem sx={{ p: 0 }} key={path} onClick={close}>
              <ListItemButton component={Link} to={path as string}>
                <ListItemIcon>{Icon ? <Icon /> : <DefaultIcon />}</ListItemIcon>
                <ListItemText>{title}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
