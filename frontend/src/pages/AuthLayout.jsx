import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthProvider } from "../hooks/useAuthProvider.js";
import { useEffect, useState } from "react";
import { isTokenValid } from "../utils.js";
import { Box } from '@chakra-ui/react';
import Loader from './LandingPage/Loader/Loader.jsx';

export const AuthLayout = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, token } = useAuthProvider();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer); 
  }, []);

  
  useEffect(() => {
    if (!loading) {
      const isValid = isTokenValid(token);
      if (user && isValid) {
        navigate("/");
      }
    }
  }, [loading, user, token, navigate]);


  if (loading) {
    return (
      <Box m={"auto"} mt={"600px"}>
        <Loader />
      </Box>
    );
  }

  return (
    <div className={'h-[100%]'}>
      <div className={'h-[100%]'}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
