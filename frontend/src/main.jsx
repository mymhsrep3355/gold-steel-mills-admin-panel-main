import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from "axios";
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import {
  RecoilRoot,

} from 'recoil';
const theme = extendTheme({
  fonts: {
    body: 'Poppins, sans-serif',
    heading: 'Poppins, sans-serif',
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
     <RecoilRoot>
     <App />
     </RecoilRoot>
      
    </ChakraProvider>
  </React.StrictMode>,
)
