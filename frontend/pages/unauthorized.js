import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Lock, ArrowBack } from '@mui/icons-material';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const iconVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      delay: 0.2,
    },
  },
};

export default function Unauthorized() {
  const router = useRouter();

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--primary-color)',
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <motion.div variants={iconVariants}>
          <Lock
            sx={{
              fontSize: '6rem',
              color: 'var(--accent-color)',
              mb: 3,
            }}
          />
        </motion.div>
        
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            color: 'var(--text-primary)',
            fontWeight: 700,
            mb: 2,
          }}
        >
          Access Denied
        </Typography>
        
        <Typography
          variant="h6"
          sx={{
            color: 'var(--text-secondary)',
            mb: 4,
          }}
        >
          You don't have permission to access this page
        </Typography>

        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{
            py: 1.5,
            px: 4,
            background: 'var(--accent-color)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            fontWeight: 600,
            '&:hover': {
              background: 'var(--accent-color)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(255, 56, 92, 0.3)',
            },
          }}
        >
          Go Back
        </Button>
      </Container>
    </Box>
  );
}
