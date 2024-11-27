import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Security,
  Search,
  Payment,
  Support,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
} from '@mui/icons-material';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const features = [
  {
    icon: <Security sx={{ fontSize: 40 }} />,
    title: 'Secure Platform',
    description: 'Your security is our top priority. We ensure safe transactions and protect your personal information.',
  },
  {
    icon: <Search sx={{ fontSize: 40 }} />,
    title: 'Easy Search',
    description: 'Find your perfect rental property with our advanced search filters and intuitive interface.',
  },
  {
    icon: <Payment sx={{ fontSize: 40 }} />,
    title: 'Secure Payments',
    description: 'Multiple payment options available with secure payment processing and transaction history.',
  },
  {
    icon: <Support sx={{ fontSize: 40 }} />,
    title: '24/7 Support',
    description: 'Our dedicated support team is always ready to help you with any questions or concerns.',
  },
];

const team = [
  {
    name: 'John Doe',
    role: 'CEO & Founder',
    image: '/team/john.jpg',
    social: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    name: 'Jane Smith',
    role: 'Head of Operations',
    image: '/team/jane.jpg',
    social: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
    },
  },
  {
    name: 'Mike Johnson',
    role: 'Lead Developer',
    image: '/team/mike.jpg',
    social: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
    },
  },
];

export default function About() {
  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        minHeight: '100vh',
        background: 'var(--primary-color)',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          component={motion.div}
          variants={itemVariants}
          sx={{
            textAlign: 'center',
            mb: 8,
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: 'var(--text-primary)',
              fontWeight: 700,
              mb: 2,
            }}
          >
            About Rent House BD
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'var(--text-secondary)',
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Your trusted partner in finding the perfect rental property in Bangladesh
          </Typography>
        </Box>

        {/* Features Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                component={motion.div}
                variants={itemVariants}
                className="glass"
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: '24px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    color: 'var(--accent-color)',
                    mb: 2,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'var(--text-secondary)',
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Mission Section */}
        <Paper
          component={motion.div}
          variants={itemVariants}
          className="glass"
          elevation={0}
          sx={{
            p: 6,
            mb: 8,
            borderRadius: '24px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: 'var(--text-primary)',
              fontWeight: 700,
              mb: 3,
            }}
          >
            Our Mission
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'var(--text-secondary)',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.8,
            }}
          >
            At Rent House BD, we're committed to revolutionizing the rental property market in Bangladesh.
            Our mission is to create a transparent, efficient, and user-friendly platform that connects
            property owners with potential tenants, making the rental process seamless and enjoyable for everyone.
          </Typography>
        </Paper>

        {/* Team Section */}
        <Box component={motion.div} variants={itemVariants}>
          <Typography
            variant="h4"
            sx={{
              color: 'var(--text-primary)',
              fontWeight: 700,
              mb: 4,
              textAlign: 'center',
            }}
          >
            Meet Our Team
          </Typography>
          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  className="glass"
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '24px',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    textAlign: 'center',
                  }}
                >
                  <Avatar
                    src={member.image}
                    alt={member.name}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      border: '4px solid var(--accent-color)',
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--text-secondary)',
                      mb: 2,
                    }}
                  >
                    {member.role}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    {Object.entries(member.social).map(([platform, url]) => (
                      <IconButton
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: 'var(--text-secondary)',
                          '&:hover': {
                            color: 'var(--accent-color)',
                          },
                        }}
                      >
                        {platform === 'facebook' && <Facebook />}
                        {platform === 'twitter' && <Twitter />}
                        {platform === 'linkedin' && <LinkedIn />}
                      </IconButton>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
