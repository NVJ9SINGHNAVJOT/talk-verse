import { Profile } from "@/redux/slices/userSlice";
import { useAppSelector } from "@/redux/store";
import { useForm } from "react-hook-form";

export type NewProfileData = {
  userName: string;
  gender: string;
  contactNumber: number;
  bio: string;
};

const Settings = () => {
  const profile = useAppSelector((state) => state.user.profile);
  const { register, handleSubmit } = useForm<Profile>({
    defaultValues: profile ? profile : {},
  });

  // You can also set default values asynchronously (e.g., fetching from an API)
  // Just make sure to handle any async operations before rendering the form.

  const onSubmit = (data: Profile) => {
    // Handle form submission
    console.log(data);
  };
  return (
    <div className=" w-full mt-14">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-9/12 mx-auto gap-8"
      >
        <div className=" flex gap-4 items-center">
          <label className=" font-semibold">User Name</label>
          <input
            className=" bg-black text-white rounded-lg px-4 py-2 outline-none"
            {...register("userName")}
            placeholder="Username"
            disabled={true}
          />
        </div>

        <div className=" flex gap-4">
          <label className=" self-start font-semibold">Bio</label>
          <textarea
            className=" w-1/2  bg-black text-white rounded-lg px-4 py-2 outline-none"
            {...register("bio")}
            placeholder="About Me"
          />
        </div>

        <div className=" flex gap-4 items-center">
          <label className=" font-semibold">Gender</label>
          <input
            className=" bg-black text-white rounded-lg px-4 py-2 outline-none"
            {...register("gender")}
            placeholder="Gender"
          />
        </div>

        <div className=" flex gap-4 items-center">
          <label className="font-semibold">Contact No.</label>
          <input
            className=" bg-black text-white rounded-lg px-4 py-2 outline-none"
            {...register("contactNumber")}
            placeholder="Contact Number"
          />
        </div>

        <div className=" flex justify-center gap-8">
          <button
            className="[box-shadow:0px_0px_57px_9px_rgba(0,0,0,0.4)] hover:scale-110 transition-all ease-in-out
           bg-black  px-10 py-2 rounded-xl text-white mt-8
            text-center cursor-pointer"
            type="submit"
          >
            Update
          </button>
          <button
            className="[box-shadow:0px_0px_57px_9px_rgba(0,0,0,0.4)] hover:scale-110 transition-all ease-in-out
           bg-white px-10 py-2 rounded-xl text-black mt-8
            text-center cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
