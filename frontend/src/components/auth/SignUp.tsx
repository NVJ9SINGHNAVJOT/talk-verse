import { signupApi } from "@/services/operations/authAPI";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { RxAvatar } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

export type SignUpData = {
  imageFile?: File,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  agree: boolean,
};

type SignInProps = {
  toggleSignIn: () => void,
}

const SignUp = (props: SignInProps) => {
  const { toggleSignIn } = props;

  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleimgTagRefClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type;

      // Check if the file type is jpg, jpeg, or png
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (validTypes.includes(fileType)) {
        setSelectedFile(file);
      } else {
        toast.error("Select .jpg/.jpeg/.png type file")
        setSelectedFile(null);
      }
    }
  };



  const { register, handleSubmit, reset } = useForm<SignUpData>();

  const onSubmitForm = async (data: SignUpData): Promise<void> => {
    if (selectedFile) {
      data.imageFile = selectedFile
    }
    signupApi(data)

    reset(data)
    navigate("/login")
    console.log("sign up form data", data)
    console.log(data);
  };


  return (
    <div className=" w-full flex flex-col justify-evenly items-center">


      <form onSubmit={handleSubmit(onSubmitForm)} className="flex w-7/12 flex-col justify-evenly items-center gap-2">

        <h2 className=" text-center text-xl text-white font-sans font-semibold">Sign Up to TalkVerse</h2>

        <p className="text-white text-center">Enter the realm of endless dialogue and discovery. Your journey begins here!</p>


        {/* image input */}
        <div className="flex justify-center items-center relative w-16 h-16" >

          <input id="imgInput" name="imageInput" ref={fileInputRef} className="absolute w-5 h-5  hidden" type="file"
            accept=".jpg ,.jpeg, .png" onChange={handleImageChange} placeholder=''
          />


          {selectedFile === null ? (
            <RxAvatar onClick={handleimgTagRefClick} className="block   absolute w-16 h-16 rounded bg-richblack-300 
            cursor-pointer" />
          ) :
            (
              <img src={URL.createObjectURL(selectedFile)} onClick={handleimgTagRefClick} className="block
                absolute w-16 h-16 object-cover rounded bg-richblack-300 cursor-pointer" alt="Avatar"
              />
            )}

        </div>




        <div className="relative z-0 w-full mb-5 group">
          <input type="text" className=" text-white block py-2.5 px-0 w-full text-sm 
            bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder="" required {...register("firstName", { required: true })}
          />
          <label className=" text-white peer-focus:font-medium absolute text-sm text-gray-500  
          duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 
          rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            First Name
          </label>
        </div>


        <div className="relative z-0 w-full mb-5 group">
          <input type="text" className=" text-white block py-2.5 px-0 w-full text-sm 
            bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder="" required {...register("lastName", { required: true })}
          />
          <label className=" text-white peer-focus:font-medium absolute text-sm text-gray-500  
          duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 
          rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Last Name
          </label>
        </div>


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
            Email Address
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

        <div className="text-white text-center ">Already have an account?</div>

        <button className=" bg-white text-black pl-4 pr-4 p-1 rounded-sm " onClick={toggleSignIn}>Log In</button>

      </div>



    </div>
  )
}

export default SignUp