import { Box, Modal, ModalProps } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { ComponentProps, PropsWithChildren } from 'react';

type AppModalProps = PropsWithChildren<ModalProps> & {
  contentProps?: ComponentProps<typeof Box>;
};

const StyledModalContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 'min(640px, calc(100% - 32px))',
  maxHeight: 'calc(100% - 32px)',
  overflowY: 'auto',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${alpha(theme.palette.divider, 0.24)}`,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const AppModal = ({ children, contentProps, ...modalProps }: AppModalProps) => {
  return (
    <Modal {...modalProps}>
      <StyledModalContent {...contentProps}>{children}</StyledModalContent>
    </Modal>
  );
};

export default AppModal;
