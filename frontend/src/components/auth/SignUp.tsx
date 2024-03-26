import { CameraAlt } from "@mui/icons-material";
import { Avatar, Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import { VisuallyHidden } from "@src/components/style/StyledComponents";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Data = {
  userName: string,
  name: string,
  bio: string,
  password: string,
  imageFile: File,
};

type SignUpProps = {
  toggleSignIn: ()=> void,
}


const SignUp = (props: SignUpProps) => {
  const {toggleSignIn} = props;

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewSource, setPreviewSource] = useState<string | ArrayBuffer | null>(null)

  const previewFile = (file: File): void => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (): void => {
      setPreviewSource(reader.result)
    }
  }

  const userImageHandler = (e: React.FormEvent<HTMLInputElement>): void => {
    e.preventDefault()
    const target = e.target as HTMLInputElement & {
      files: FileList,
    }
    const file = target.files[0]
    if (file) {
      setImageFile(file)
      previewFile(file)
    }
    else{
      toast("Error while selecting image")
    }
  }

  const { register, handleSubmit, reset, formState:{isSubmitSuccessful} } = useForm<Data>();

  const onSubmitForm = async (data: Data): Promise<void> => {
    if(imageFile){
      data.imageFile = imageFile
    }
    console.log("sign up form data", data)
    await console.log(data); 
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        userName: "",
        name: "",
        bio: "",
        password: "",
      });
      setPreviewSource(null);
    }
  }, [isSubmitSuccessful, reset])

  return (
    <div>
      <Typography variant="h5" sx={{ textAlign: "center" }} className="mb-2">
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Stack position={"relative"} width={"10rem"} margin={"auto"}>
          <Avatar
            sx={{
              width: "10rem",
              height: "10rem",
              objectFit: "contain",
            }}
            src = {previewSource}
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
              <VisuallyHidden type="file" accept="image/png, image/gif, image/jpeg" onChange={userImageHandler}/>
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
