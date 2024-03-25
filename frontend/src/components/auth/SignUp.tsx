import { CameraAlt } from "@mui/icons-material";
import { Avatar, Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import { VisuallyHidden } from "@src/components/style/StyledComponents";
import { useForm } from "react-hook-form";

type Data = {
  userName: string,
  name: string,
  bio: string,
  password: string,
};

type SignUpProps = {
  toggleSignIn: ()=> void,
}


const SignUp = (props: SignUpProps) => {
  const {toggleSignIn} = props;

  const onSubmitForm = async (data: Data) => {
    await console.log(data);
  };

  const { register, handleSubmit } = useForm<Data>();

  return (
    <div>
      <Typography variant="h5" sx={{ textAlign: "center" }} className="mb-2">
        Sign Up
      </Typography>
      <form className="signinForm" onSubmit={handleSubmit(onSubmitForm)}>
        <Stack position={"relative"} width={"10rem"} margin={"auto"}>
          <Avatar
            sx={{
              width: "10rem",
              height: "10rem",
              objectFit: "contain",
            }}
          />

          <IconButton
            sx={{
              position: "absolute",
              bottom: "0",
              right: "0",
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              ":hover": {
                bgcolor: "rgba(0,0,0,0.7)",
              },
            }}
            component="label"
          >
            <>
              <CameraAlt />
              <VisuallyHidden type="file" />
            </>
          </IconButton>
        </Stack>

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
          label="Name"
          margin="normal"
          variant="outlined"
          {...register("name", { required: true })}
        />
        <TextField
          required
          fullWidth
          label="Bio"
          margin="normal"
          variant="outlined"
          {...register("bio", { required: true })}
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
          Sign Up
        </Button>
        <Typography textAlign={"center"} m={"1rem"}>
          Already have an account?
        </Typography>
        <Button
          fullWidth
          variant="text"
          onClick={toggleSignIn}
          color="secondary"
        >
          Log In
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
