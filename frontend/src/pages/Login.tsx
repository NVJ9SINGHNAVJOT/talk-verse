import {
  Avatar,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const Login = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const toggleSignin = () => {setIsLogin((prev: boolean) => !prev)};
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
        {isLogin ? (
          <div>
            <Typography variant="h5" sx={{textAlign:"center"}}>Log In</Typography>
            <form className="loginForm">
              <TextField
                required
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
              />
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
              />
              <Button
                sx={{
                  marginTop: "1rem",
                }}
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
              >
                Log In
              </Button>
              <Typography textAlign={"center"} m={"1rem"}>Don't have an account?</Typography>
              <Button
                fullWidth
                variant="text"
                onClick={toggleSignin}
                color="secondary"
              >
                Sign Up
              </Button>
            </form>
          </div>
        ) : (
          <div>
            <Typography variant="h5" sx={{textAlign:"center"}}>Sign up</Typography>
            <form className="signinForm">

              <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                <Avatar sx={{
                  width:"10rem",
                  height:"10rem",
                  objectFit:"contain",
                }}/>
              </Stack>

              <TextField
                required
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
              />
              <TextField
                required
                fullWidth
                label="Name"
                margin="normal"
                variant="outlined"
              />
              <TextField
                required
                fullWidth
                label="Bio"
                margin="normal"
                variant="outlined"
              />
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
              />
              <Button
                sx={{
                  marginTop: "1rem",
                }}
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
              >
                Sign Up
              </Button>
              <Typography textAlign={"center"} m={"1rem"}>Already have an account?</Typography>
              <Button
                fullWidth
                variant="text"
                onClick={toggleSignin}
                color="secondary"
              >
                Log In
              </Button>
            </form>
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default Login;
