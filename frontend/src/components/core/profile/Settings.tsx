import { countryCodes } from "@/assets/data/countryCodes";
import { Profile } from "@/redux/slices/userSlice";
import { useAppSelector } from "@/redux/store";
import { checkUserNameApi } from "@/services/operations/profileApi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";

export type NewProfileData = {
  userName: string;
  gender: string;
  contactNumber: number;
  bio: string;
};

const Settings = () => {
  const [disabled, setDisabled] = useState<string[]>([]);
  const profile = useAppSelector((state) => state.user.profile);

  const { register, handleSubmit } = useForm<Profile>({
    defaultValues: profile ? profile : {},
  });

  const updateDisable = (value: string) => {
    if (disabled.includes(value)) {
      return;
    }
    setDisabled((prev) => [...prev, value]);
  };
  const onSubmit = async (data: Profile) => {
    if (profile?.userName !== data.userName) {
      const response = await checkUserNameApi(data.userName);

    }
    // Handle form submission
    console.log(data);
  };
  return (
    <div className=" w-full mt-14 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-fit mx-auto gap-8"
      >
        <div className=" flex gap-4 items-center">
          <label className=" font-semibold">User Name</label>
          <input
            className=" bg-black text-white rounded-lg px-4 py-2 outline-none"
            {...register("userName", {
              required: true,
              pattern: /^[a-zA-Z][a-zA-Z0-9_-]{2,}$/,
              maxLength: 10,
              minLength: 3,
            })}
            placeholder="Username"
            disabled={!disabled.includes("userName")}
          />
          <FaEdit
            onClick={() => updateDisable("userName")}
            className=" cursor-pointer size-4 fill-black hover:fill-white"
          />
        </div>

        <div className=" flex gap-4">
          <label className=" self-start font-semibold">Bio</label>
          <textarea
            className=" w-80 bg-black text-white rounded-lg px-4 py-2 outline-none h-32 resize-none"
            {...register("bio", {
              maxLength: 150,
              minLength: 1,
            })}
            placeholder="About Me"
            disabled={!disabled.includes("bio")}
            maxLength={100}
          />
          <FaEdit
            onClick={() => updateDisable("bio")}
            className=" cursor-pointer size-4 fill-black hover:fill-white self-start"
          />
        </div>

        <div className=" flex gap-4 items-center">
          <label className=" font-semibold">Gender</label>
          <div className=" flex items-center gap-2">
            <span className=" text-richblack-700 text-sm">Male</span>
            <input
              className=" mt-1"
              type="radio"
              value="Male"
              {...register("gender")}
              placeholder="Gender"
              disabled={!disabled.includes("gender")}
            />
          </div>
          <div className=" flex items-center gap-2">
            <span className=" text-richblack-700 text-sm">Female</span>
            <input
              className=" mt-1"
              type="radio"
              value="Female"
              {...register("gender")}
              placeholder="Gender"
              disabled={!disabled.includes("gender")}
            />
          </div>
          <div className=" flex items-center gap-2">
            <span className=" text-richblack-700 text-sm">Other</span>
            <input
              className=" mt-1"
              type="radio"
              value="Other"
              {...register("gender")}
              placeholder="Gender"
              disabled={!disabled.includes("gender")}
            />
          </div>
          <FaEdit
            onClick={() => updateDisable("gender")}
            className=" cursor-pointer size-4 fill-black hover:fill-white"
          />
        </div>

        <div className=" flex gap-4 items-center">
          <label className="font-semibold">Country Code</label>
          <select
            {...register("countryCode")}
            className="  bg-black text-white rounded-lg px-4 py-2 outline-none text-center"
            disabled={!disabled.includes("countryCode")}
          >
            {!profile?.countryCode && (
              <option defaultValue={""}>Select Country Code</option>
            )}

            {countryCodes.map((data, i) => {
              return (
                <option key={i} value={data.code}>
                  {data.country} {data.code}
                </option>
              );
            })}
          </select>
          <FaEdit
            onClick={() => updateDisable("countryCode")}
            className=" cursor-pointer size-4 fill-black hover:fill-white"
          />
        </div>

        <div className=" flex gap-4 items-center">
          <label className="font-semibold">Contact No.</label>
          <input
            type="number"
            className=" bg-black text-white rounded-lg px-4 py-2 outline-none "
            {...register("contactNumber", {
              min: 1,
              max: 999999999,
              minLength: 1,
              maxLength: 9,
            })}
            onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
            placeholder="Contact Number"
            disabled={!disabled.includes("contactNumber")}
            onFocus={(e) =>
              e.target.addEventListener("wheel", (event) => {
                event.preventDefault();
              })
            }
          />
          <FaEdit
            onClick={() => updateDisable("contactNumber")}
            className=" cursor-pointer size-4 fill-black hover:fill-white"
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
