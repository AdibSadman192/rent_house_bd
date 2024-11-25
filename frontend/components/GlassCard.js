import { Paper, Box } from '@mui/material';

const GlassCard = ({ children, elevation = 0, hover = true, ...props }) => {
  return (
    <Paper
      elevation={elevation}
      {...props}
      sx={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        ...(hover && {
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            '&::before': {
              opacity: 1,
            },
          },
        }),
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(120deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
          opacity: 0.5,
          transition: 'opacity 0.3s ease-in-out',
          zIndex: 0,
        },
        ...props.sx
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

export default GlassCard;
