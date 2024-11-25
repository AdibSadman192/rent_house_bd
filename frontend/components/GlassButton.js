import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const GlassButton = styled(Button)(({ theme, variant = 'contained', color = 'primary', size = 'medium' }) => ({
  background: variant === 'contained' 
    ? `linear-gradient(45deg, ${theme.palette[color].main} 30%, ${theme.palette[color].light} 90%)`
    : 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: variant === 'contained'
    ? 'none'
    : `1px solid ${theme.palette[color].main}`,
  borderRadius: '8px',
  boxShadow: variant === 'contained'
    ? '0 4px 20px rgba(0, 0, 0, 0.15)'
    : 'none',
  color: variant === 'contained'
    ? '#fff'
    : theme.palette[color].main,
  padding: size === 'large'
    ? '12px 24px'
    : size === 'small'
      ? '6px 16px'
      : '8px 20px',
  textTransform: 'none',
  fontWeight: 500,
  letterSpacing: '0.5px',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(120deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
  },

  '&:hover': {
    background: variant === 'contained'
      ? `linear-gradient(45deg, ${theme.palette[color].dark} 30%, ${theme.palette[color].main} 90%)`
      : 'rgba(255, 255, 255, 0.2)',
    boxShadow: variant === 'contained'
      ? '0 6px 30px rgba(0, 0, 0, 0.2)'
      : 'none',
    transform: 'translateY(-2px)',

    '&::before': {
      opacity: 1,
    },
  },

  '&:active': {
    transform: 'translateY(0)',
    boxShadow: variant === 'contained'
      ? '0 2px 10px rgba(0, 0, 0, 0.1)'
      : 'none',
  },

  '&.Mui-disabled': {
    background: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    boxShadow: 'none',
    border: 'none',
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none',

    '&::before': {
      display: 'none',
    },
  },

  // Loading state
  '& .MuiCircularProgress-root': {
    marginRight: theme.spacing(1),
    color: 'inherit',
  },

  // Icon styling
  '& .MuiButton-startIcon, & .MuiButton-endIcon': {
    transition: 'transform 0.2s ease-in-out',
  },

  '&:hover .MuiButton-startIcon': {
    transform: 'translateX(-2px)',
  },

  '&:hover .MuiButton-endIcon': {
    transform: 'translateX(2px)',
  },
}));

export default GlassButton;
