import { useForm } from "react-hook-form";

type Data = {
  email: string,
  password: string,
  confirmPassword: string,
  agree: boolean,
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
    <div className="flex flex-col justify-center">


    </div>
  )
}

export default LogIn