import { Button, TextField, Typography } from "@mui/material"
import { useForm } from "react-hook-form";

type Data = {
  userName: string,
  password: string,
};

type LogInProps = {
  toggleSignIn: ()=> void,
}

const LogIn = (props: LogInProps) => {
  const {toggleSignIn} = props;

  const onSubmitForm = async (data: Data) => {
    console.log("log in form data", data)
    await console.log(data); 
  };

  const { register, handleSubmit } = useForm<Data>();

  return (
    <div>
            <Typography variant="h5" sx={{textAlign:"center"}}>Log In</Typography>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <TextField
                required
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                {...register("userName", { required: true })}
              />
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                {...register("password", { required: true })}
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
                onClick={toggleSignIn}
                color="secondary"
              >
                Sign Up
              </Button>
            </form>
          </div>
  )
}

export default LogIn