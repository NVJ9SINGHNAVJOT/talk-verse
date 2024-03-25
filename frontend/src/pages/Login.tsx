import {Container,Paper} from "@mui/material";
import { useState } from "react";
import LogIn from "@src/components/auth/LogIn";
import SignUp from "@src/components/auth/SignUp";


const Login = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const toggleSignIn = () => {setIsLogin((prev: boolean) => !prev)};

  return (
    <Container component={"main"} maxWidth="xs"
      sx={{
        width:"100%",
        height:"100%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isLogin ? (<LogIn toggleSignIn = {toggleSignIn}/>) : (<SignUp toggleSignIn = {toggleSignIn}/>)}
      </Paper>
    </Container>
  );
};

export default Login;
