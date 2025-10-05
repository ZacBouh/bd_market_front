import GitHubIcon from '@mui/icons-material/GitHub';
import ThemeIcon from '@mui/icons-material/InvertColors';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { AppBar, Button, Divider, IconButton, Stack, Toolbar, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useArtists, usePublishers, useTitles } from '@/hooks';
import { useNotifications } from '@toolpad/core/useNotifications';
import { useThemeMode } from '@/theme';
import { getRandomJoke } from './utils';
import { useUser } from '@/hooks/useUser';
import { store, userAtom } from '@/store';
import ShoppingCart from '@/components/Menu/ShoppingCart/ShoppingCart';
import ButtonMenu from '@/components/Menu/ButtonMenu/ButtonMenu';
import BurgerMenuIcon from '@mui/icons-material/Menu'
import DevMenuIcon from '@mui/icons-material/DataObject'
import { useSidebar } from '../Sidebar/hooks';

function Header() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { themeMode, toggle: toggleThemeMode } = useThemeMode();
  const  {toggle : toggleSideBar, width: sideBarWidth}= useSidebar()
  const notifications = useNotifications();
  const {setArtists} = useArtists()
  const {setTitles} = useTitles()
  const {setPublishers} = usePublishers()
  const {user} = useUser()

  function showNotification() {
    notifications.show(getRandomJoke(), {
      autoHideDuration: 5000,
    });
  }

  const handleClearLocalStorageState = () => {
    setArtists([])
    setTitles([])
    setPublishers([])
    console.log('cleared data in local storage')
  }

  return (
    <AppBar
      position="relative"
      color="transparent"
      elevation={2}
      data-pw={`theme-${themeMode}`}
      enableColorOnDark
      sx={{maxWidth: '100vw', overflow: 'clip'}}
    >
      <Toolbar sx={{transition: "margin-left 0.2s", marginLeft: `${sideBarWidth}px`, }} >
        <Stack direction="row" justifyContent="space-between" alignItems="center" flex={1}>
          <Stack direction="row" gap={1} alignItems="center">
            <Button onClick={showNotification} color="info">
              {"BD Project"}
            </Button>
          </Stack>
          <Stack direction="row" alignItems="center">
            <ShoppingCart/>
            <Divider orientation="vertical" flexItem />

            {/* DEV MENU */}
            <ButtonMenu
              ButtonElement={IconButton}
              buttonProps={{children: <DevMenuIcon/>}}
            >
              <Stack direction={'column'} sx={{display: 'flex', alignItems: 'start', pr: 2}}>
                <Tooltip title="Get user atom content" arrow>
                <IconButton color="info" size="large" component="a" onClick={() => console.log("Current User", user)} target="_blank">
                  <GitHubIcon /><Typography sx={{ml: 1}} >Log User Info</Typography> 
                </IconButton>
                </Tooltip>
                {/* <Divider orientation="horizontal" flexItem /> */}
                <Tooltip title="Clear user atom content" arrow>
                  <IconButton color="error" size="large" component="a" onClick={() => user && store.set(userAtom, {...user, token: '' })} target="_blank">
                    <GitHubIcon /><Typography sx={{ml: 1}} >Clear user state</Typography>
                  </IconButton>
                </Tooltip>
                {/* <Divider orientation="horizontal" flexItem /> */}
                <Tooltip title="Switch theme" arrow>
                  <IconButton
                    color="default"
                    edge="end"
                    size="large"
                    onClick={toggleThemeMode}
                    data-pw="theme-toggle"
                  >
                    <ThemeIcon /><Typography sx={{ml: 1}} >Toggle theme</Typography>
                  </IconButton>
                </Tooltip>
                {/* <Divider orientation="horizontal" flexItem /> */}
                <Tooltip title="Clear state in local storage" arrow>
              <IconButton
                color="error"
                edge="end"
                size="large"
                onClick={handleClearLocalStorageState}
              >
                <DeleteForeverIcon /><Typography sx={{ml: 1}} >Clear local storage state</Typography>
              </IconButton>
            </Tooltip>
              </Stack>
            </ButtonMenu>
            {isMobile && 
              <>
                <Divider orientation="vertical" flexItem />
                <IconButton onClick={toggleSideBar} >
                  <BurgerMenuIcon />
                </IconButton>
              </>
            }
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
