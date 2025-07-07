import { useCallback } from 'react';
import { useAtom } from 'jotai';

import { useTheme } from '@mui/material';
import { isSidebarOpenState, sideMenuWidth } from './atoms';

function useSidebar() {
  const [isOpen, setIsOpen] = useAtom(isSidebarOpenState);
  const [width, setWidth] = useAtom(sideMenuWidth)
  const theme = useTheme()

  const toggle = useCallback(() => {
      setWidth(width => width === 0 ? theme.custom.sideMenuWidth : 0 )
      setIsOpen((isOpen) =>!isOpen)
    } 
    , [setIsOpen, setWidth]);
  const close = useCallback(() => {
      setIsOpen(false)
      setWidth(0)
    }
    , [setIsOpen, setWidth]);
  const open = useCallback(() => {
      setIsOpen(true)
      setWidth(theme.custom.sideMenuWidth)
    } 
    , [setIsOpen, setWidth]);

  return {
    isOpen,
    toggle,
    close,
    open,
    width
  };
}

export { useSidebar };
