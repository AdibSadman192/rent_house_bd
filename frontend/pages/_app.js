import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css';
import theme from '@/theme';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { ErrorBoundary } from '@/middleware/error-handler';
import { ENV } from '@/config';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>RentHouse BD</title>
      </Head>
      <ErrorBoundary>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Layout>
              <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    theme: {
                      primary: '#4aed88',
                    },
                  },
                }}
              />
              <Component {...pageProps} />
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </Layout>
          </ThemeProvider>
        </AuthProvider>
      </ErrorBoundary>
    </>
  );
}

export default MyApp;
