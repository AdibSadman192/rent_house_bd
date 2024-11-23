import React from 'react';
import { Box, Container, Typography, Tabs, Tab } from '@mui/material';
import { useRouter } from 'next/router';
import BookingForm from '../../components/BookingForm';
import BookingList from '../../components/BookingList';
import { useAuth } from '../../contexts/AuthContext';

const BookingsPage = () => {
  const [tab, setTab] = React.useState(0);
  const { user } = useAuth();
  const router = useRouter();
  const { propertyId, propertyPrice } = router.query;

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleBookingSuccess = () => {
    setTab(1); // Switch to the bookings list tab
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          Please log in to manage bookings
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Property Bookings
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Create Booking" />
          <Tab label="My Bookings" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Box>
          {propertyId ? (
            <BookingForm
              propertyId={propertyId}
              propertyPrice={Number(propertyPrice)}
              onSuccess={handleBookingSuccess}
            />
          ) : (
            <Typography>
              Please select a property from the listings to make a booking.
            </Typography>
          )}
        </Box>
      )}

      {tab === 1 && (
        <BookingList
          userRole={user.role}
          userId={user.id}
        />
      )}
    </Container>
  );
};

export default BookingsPage;
