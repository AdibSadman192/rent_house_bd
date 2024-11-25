import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const GlassInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease-in-out',
    overflow: 'hidden',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(120deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
      opacity: 0,
      transition: 'opacity 0.3s ease-in-out',
      zIndex: 0,
    },

    '& .MuiInputBase-input': {
      position: 'relative',
      zIndex: 1,
      padding: '12px 16px',
      color: theme.palette.text.primary,

      '&::placeholder': {
        color: theme.palette.text.secondary,
        opacity: 0.7,
      },
    },

    '& .MuiInputAdornment-root': {
      position: 'relative',
      zIndex: 1,
      color: theme.palette.text.secondary,
    },

    '&:hover': {
      background: 'rgba(255, 255, 255, 0.15)',
      borderColor: 'rgba(255, 255, 255, 0.3)',

      '&::before': {
        opacity: 1,
      },

      '& .MuiInputAdornment-root': {
        color: theme.palette.primary.main,
      },
    },

    '&.Mui-focused': {
      background: 'rgba(255, 255, 255, 0.2)',
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`,

      '& .MuiInputAdornment-root': {
        color: theme.palette.primary.main,
      },
    },

    '&.Mui-error': {
      borderColor: theme.palette.error.main,
      
      '&.Mui-focused': {
        boxShadow: `0 0 0 2px ${theme.palette.error.main}25`,
      },
    },

    '&.Mui-disabled': {
      background: theme.palette.action.disabledBackground,
      borderColor: 'transparent',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',

      '& .MuiInputBase-input': {
        color: theme.palette.text.disabled,
      },

      '& .MuiInputAdornment-root': {
        color: theme.palette.text.disabled,
      },

      '&::before': {
        display: 'none',
      },
    },
  },

  '& .MuiFormLabel-root': {
    color: theme.palette.text.secondary,
    transition: 'color 0.3s ease-in-out',

    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },

    '&.Mui-error': {
      color: theme.palette.error.main,
    },

    '&.Mui-disabled': {
      color: theme.palette.text.disabled,
    },
  },

  '& .MuiFormHelperText-root': {
    marginLeft: '4px',
    marginRight: '4px',

    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
}));

export default GlassInput;
