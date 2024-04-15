import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


export type LogInData = {
  email: string,
  password: string,
  confirmPassword: string,
};

type SignInProps = {
  toggleSignIn: () => void,
}

const LogIn = (props: SignInProps) => {
  const { toggleSignIn } = props;
  const navigate = useNavigate();

  const onSubmitForm = async (data: LogInData) => {
    console.log("log in form data", data);

    navigate("/");
  };

  const { register, handleSubmit } = useForm<LogInData>();

  return (
    <div className=" w-full flex flex-col justify-evenly items-center">


      <form onSubmit={handleSubmit(onSubmitForm)} className="flex w-7/12 flex-col justify-evenly items-center gap-4">

        <h2 className=" text-center text-xl text-white font-sans font-semibold">Log In to TalkVerse</h2>

        <div className="relative z-0 w-full mb-5 group">
          <input type="email" className=" text-white block py-2.5 px-0 w-full text-sm 
            bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder="" required {...register("email", { required: true })}
          />
          <label className=" text-white peer-focus:font-medium absolute text-sm text-gray-500  
          duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 
          rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input type="password" className=" text-white block py-2.5 px-0 w-full text-sm 
            bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder="" required {...register("password", { required: true })}
          />
          <label className=" text-white peer-focus:font-medium absolute text-sm text-gray-500  
            duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 
            rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </label>
        </div>


        <div className="relative z-0 w-full mb-5 group">
          <input type="password" className=" text-white block py-2.5 px-0 w-full text-sm 
            bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder="" required {...register("confirmPassword", { required: true })}
          />
          <label className=" text-white peer-focus:font-medium absolute text-sm text-gray-500  
            duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 
            rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Confirm Password
          </label>
        </div>

        <button type="submit" className=" bg-white text-black p-1 rounded-sm w-full">Submit</button>

      </form>

      
      
      <div className="flex flex-col items-center gap-5">

        <div className="text-white text-center ">Not a member yet? Join the conversation today!</div>
        
        <button className=" bg-white text-black pl-4 pr-4 p-1 rounded-sm " onClick={toggleSignIn}>Sign Up</button>

      </div>



    </div>
  );
};

export default LogIn;