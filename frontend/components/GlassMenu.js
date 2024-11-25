import { Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    padding: theme.spacing(1),
    minWidth: '200px',
    
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(120deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
      borderRadius: 'inherit',
      opacity: 0,
      transition: 'opacity 0.3s ease-in-out',
      zIndex: 0,
    },

    '&:hover::before': {
      opacity: 1,
    },
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: '8px',
  padding: theme.spacing(1, 2),
  margin: theme.spacing(0.5, 0),
  position: 'relative',
  zIndex: 1,
  transition: 'all 0.3s ease-in-out',
  
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1.5),
    fontSize: '1.25rem',
    transition: 'transform 0.2s ease-in-out',
  },

  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateX(4px)',

    '& .MuiSvgIcon-root': {
      transform: 'scale(1.1)',
    },
  },

  '&.Mui-selected': {
    background: 'rgba(33, 150, 243, 0.15)',
    
    '&:hover': {
      background: 'rgba(33, 150, 243, 0.25)',
    },
  },

  '&.danger': {
    color: theme.palette.error.main,
    
    '&:hover': {
      background: 'rgba(211, 47, 47, 0.1)',
    },
  },
}));

const GlassMenu = ({ children, ...props }) => {
  return (
    <StyledMenu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    >
      {children}
    </StyledMenu>
  );
};

export { GlassMenu, StyledMenuItem as GlassMenuItem };
