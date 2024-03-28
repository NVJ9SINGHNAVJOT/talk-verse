import { Container, Paper } from "@mui/material";
import { useState } from "react";
import LogIn from "@src/components/auth/LogIn";
import SignUp from "@src/components/auth/SignUp";
import {login} from "@src/constants/color";

const Login = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const toggleSignIn = () => { setIsLogin((prev: boolean) => !prev) };

  return (
    <div className='w-full h-full flex justify-center items-center overflow-y-auto'
      style={login}
    >
      <Container component={"main"} maxWidth="xs"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0rem",
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
          {isLogin ? (<LogIn toggleSignIn={toggleSignIn} />) : (<SignUp toggleSignIn={toggleSignIn} />)}
        </Paper>
      </Container>
    </div>

  );
};

export default Login;
