import { Container, Paper } from "@mui/material";
import { useState } from "react";
import LogIn from "@src/components/auth/LogIn";
import SignUp from "@src/components/auth/SignUp";

const divStyle = {
  backgroundImage: "linear-gradient(to top, #fcc5e4 0%, #fda34b 15%, #ff7882 35%, #c8699e 52%, #7046aa 71%, #0c1db8 87%, #020f75 100%)",
};

const Login = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const toggleSignIn = () => { setIsLogin((prev: boolean) => !prev) };

  return (
    <div className='w-full h-full flex justify-center items-center overflow-y-auto'
      style={divStyle}
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
