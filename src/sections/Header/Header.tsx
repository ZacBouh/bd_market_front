import GitHubIcon from '@mui/icons-material/GitHub';
import ThemeIcon from '@mui/icons-material/InvertColors';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { AppBar, Button, Divider, IconButton, Stack, Toolbar, Tooltip } from '@mui/material';
import { useAuthors, usePublishers, useTitles } from '@/hooks';

import { useNotifications } from '@toolpad/core/useNotifications';

import { repository, title } from '@/config';
import { useHotKeysDialog } from '@/sections/HotKeys/hooks';
import { useThemeMode } from '@/theme';

import { HotKeysButton } from './styled';
import { getRandomJoke } from './utils';

function Header() {
  const { themeMode, toggle: toggleThemeMode } = useThemeMode();
  const { open: openHotKeysDialog } = useHotKeysDialog();
  const notifications = useNotifications();
  const {setAuthorsList} = useAuthors()
  const {setTitles} = useTitles()
  const {setPublishersList} = usePublishers()

  function showNotification() {
    notifications.show(getRandomJoke(), {
      autoHideDuration: 5000,
    });
  }

  const handleClearLocalStorageState = () => {
    setAuthorsList([])
    setTitlesList([])
    setPublishersList([])
    console.log('cleared data in local storage')
  }

  return (
    <AppBar
      position="relative"
      color="transparent"
      elevation={2}
      data-pw={`theme-${themeMode}`}
      enableColorOnDark
    >
      <Toolbar>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flex={1}>
          <Stack direction="row" gap={1} alignItems="center">
            <Button onClick={showNotification} color="info">
              {"BD Project"}
            </Button>
          </Stack>
          <Stack direction="row" alignItems="center">
            <Tooltip title="Hot keys" arrow>
              <HotKeysButton
                size="small"
                variant="outlined"
                aria-label="open hotkeys dialog"
                onClick={openHotKeysDialog}
              >
                alt + k
              </HotKeysButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="It's open source" arrow>
              <IconButton color="info" size="large" component="a" href={repository} target="_blank">
                <GitHubIcon />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Switch theme" arrow>
              <IconButton
                color="info"
                edge="end"
                size="large"
                onClick={toggleThemeMode}
                data-pw="theme-toggle"
              >
                <ThemeIcon />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Clear state in local storage" arrow>
              <IconButton
                color="error"
                edge="end"
                size="large"
                onClick={handleClearLocalStorageState}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
