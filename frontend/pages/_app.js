import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from '../styles/theme';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  // Check if the Component needs a layout
  const getLayout = Component.getLayout || ((page) => {
    // If the component has auth=false, don't wrap it in Layout
    return Component.auth === false ? page : <Layout>{page}</Layout>;
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        {getLayout(<Component {...pageProps} />)}
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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
