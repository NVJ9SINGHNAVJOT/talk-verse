import { countryCodes } from "@/data/countryCodes";
import { type Profile, setProfile } from "@/redux/slices/userSlice";
import { useAppSelector } from "@/redux/store";
import { changePasswordApi } from "@/services/operations/authApi";
import { checkUserNameApi, setProfileDetailsApi } from "@/services/operations/profileApi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export type NewProfileData = {
  userName?: string;
  gender?: string;
  dateOfBirth?: string;
  countryCode?: string;
  contactNumber?: string;
  bio?: string;
};

export type ChangePassword = {
  oldPassword: string;
  newPassword: string;
};

const Settings = () => {
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState<string[]>([]);
  const profile = useAppSelector((state) => state.user.profile);
  const [loading, setLoading] = useState<boolean>(false);
  const [changingPassword, setChangingPassword] = useState<boolean>(false);
  const { register, handleSubmit, reset } = useForm<Profile>({
    defaultValues: profile ? profile : {},
  });
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors },
  } = useForm<ChangePassword>();

  const updateDisable = (value: string) => {
    if (disabled.includes(value)) {
      return;
    }
    setDisabled((prev) => [...prev, value]);
  };

  const onSubmit = async (data: Profile) => {
    setLoading(true);

    const newProfileData: NewProfileData = {};
    let change = false;

    if (profile?.userName !== data.userName) {
      const response = await checkUserNameApi(data.userName);
      if (response) {
        if (response.success === false) {
          toast.info("This userName is already in use");
          setLoading(false);
          return;
        }
        newProfileData.userName = data.userName;
        change = true;
      } else {
        toast.error("Error while checking userName availability");
        setLoading(false);
        return;
      }
    }

    setDisabled([]);

    if (data.bio && profile?.bio !== data.bio) {
      const linesArray = data.bio.split(/\r?\n/);
      while (linesArray.length && !linesArray[0].trim()) {
        linesArray.shift();
      }
      while (linesArray.length && !linesArray[linesArray.length - 1].trim()) {
        linesArray.pop();
      }

      if (!linesArray.length) {
        toast.info("invalid bio input");
        setLoading(false);
        return;
      }

      newProfileData.bio = linesArray.map((value) => value.trim()).join(" ");
      change = true;
    }
    if (data.gender && profile?.gender !== data.gender) {
      newProfileData.gender = data.gender;
      change = true;
    }
    if (data.dateOfBirth && profile?.dateOfBirth !== data.dateOfBirth) {
      newProfileData.dateOfBirth = data.dateOfBirth;
      change = true;
    }
    if ("Select Country Code" !== data.countryCode && profile?.countryCode !== data.countryCode) {
      newProfileData.countryCode = data.countryCode;
      change = true;
    }
    /*
      HACK: contact number is number by type in input, but still in output in form it comes as string.
      to handle this, for getting contact number as number this is used parseInt(`${data.contactNumber}`)
    */
    if (data.contactNumber && profile?.contactNumber !== parseInt(`${data.contactNumber}`)) {
      if ("Select Country Code" === data.countryCode || (!profile?.countryCode && !data.countryCode)) {
        toast.info("Country code is required for contact number");
        setLoading(false);
        return;
      }
      newProfileData.contactNumber = `${data.contactNumber}`;
      change = true;
    }

    if (change) {
      const response = await setProfileDetailsApi(newProfileData);

      if (response) {
        if (response.success === true) {
          toast.success("Profile updated");
        } else {
          toast.error("userName is not got updated");
        }
        dispatch(setProfile(response.userData));
      } else {
        toast.error("Error while updating profile");
      }
    }

    setLoading(false);
  };

  const resetHandler = () => {
    setDisabled([]);
    if (profile) {
      reset(profile);
    }
  };

  const changePassword = async (data: ChangePassword) => {
    if (data.oldPassword === data.newPassword) {
      toast.info("cannot update same password");
      return;
    }
    setChangingPassword(true);
    resetPassword();
    const response = await changePasswordApi(data);

    if (!response) {
      toast.error("error while changing password");
    } else if (response.success === false) {
      toast.info(response.message);
    } else {
      toast.success("password changed");
    }

    setChangingPassword(false);
  };

  return (
    <div className="mt-6 flex w-full flex-col">
      <div className="my-5 pl-4 font-be-veitnam-pro text-4xl lm:pl-10">Profile</div>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex w-fit flex-col gap-8">
        <div className="flex items-center gap-4">
          <label className="font-semibold">User Name</label>
          <input
            className="rounded-lg bg-black px-4 py-2 text-white outline-none"
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
            className={`size-4 cursor-pointer hover:fill-white ${disabled.includes("userName") ? "fill-white" : "fill-black"}`}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="font-semibold">Date of Birth</label>
          <input
            type="date"
            className="rounded-lg bg-black px-4 py-2 text-white outline-none"
            {...register("dateOfBirth", {
              max: {
                value: new Date().toISOString().split("T")[0],
                message: "Date of Birth cannot be in the future.",
              },
            })}
            disabled={!disabled.includes("dateOfBirth")}
            placeholder="BirthDay"
          />
          <FaEdit
            onClick={() => updateDisable("dateOfBirth")}
            className={`size-4 cursor-pointer hover:fill-white ${disabled.includes("dateOfBirth") ? "fill-white" : "fill-black"}`}
          />
        </div>

        <div className="flex gap-4">
          <label className="self-start font-semibold">Bio</label>
          <textarea
            className="h-32 w-80 resize-none rounded-lg bg-black px-4 py-2 text-white outline-none"
            {...register("bio", {
              maxLength: 150,
              minLength: 1,
            })}
            maxLength={150}
            placeholder="About Me"
            disabled={!disabled.includes("bio")}
          />
          <FaEdit
            onClick={() => updateDisable("bio")}
            className={`size-4 cursor-pointer hover:fill-white ${disabled.includes("bio") ? "fill-white" : "fill-black"}`}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="font-semibold">Gender</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-richblack-700">Male</span>
            <input
              className="mt-1"
              type="radio"
              value="Male"
              {...register("gender")}
              placeholder="Gender"
              disabled={!disabled.includes("gender")}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-richblack-700">Female</span>
            <input
              className="mt-1"
              type="radio"
              value="Female"
              {...register("gender")}
              placeholder="Gender"
              disabled={!disabled.includes("gender")}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-richblack-700">Other</span>
            <input
              className="mt-1"
              type="radio"
              value="Other"
              {...register("gender")}
              placeholder="Gender"
              disabled={!disabled.includes("gender")}
            />
          </div>
          <FaEdit
            onClick={() => updateDisable("gender")}
            className={`size-4 cursor-pointer hover:fill-white ${disabled.includes("gender") ? "fill-white" : "fill-black"}`}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="font-semibold">Country Code</label>
          <select
            {...register("countryCode")}
            className="rounded-lg bg-black px-4 py-2 text-center text-white outline-none"
            disabled={!disabled.includes("countryCode")}
          >
            {!profile?.countryCode && <option defaultValue={""}>Select Country Code</option>}

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
            className={`size-4 cursor-pointer hover:fill-white ${disabled.includes("countryCode") ? "fill-white" : "fill-black"}`}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="font-semibold">Contact No.</label>
          <input
            type="number"
            className="rounded-lg bg-black px-4 py-2 text-white outline-none"
            {...register("contactNumber", {
              min: 1000000000,
              max: 9999999999,
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
            className={`size-4 cursor-pointer hover:fill-white ${disabled.includes("contactNumber") ? "fill-white" : "fill-black"}`}
          />
        </div>

        <div className="flex justify-center gap-8">
          <button
            type="submit"
            disabled={loading}
            className="mt-8 cursor-pointer rounded-xl bg-black px-10 py-2 text-center text-white transition-all 
            ease-in-out [box-shadow:0px_0px_57px_9px_rgba(0,0,0,0.4)] hover:scale-110"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => resetHandler()}
            disabled={loading}
            className="mt-8 cursor-pointer rounded-xl bg-white px-10 py-2 text-center text-black transition-all 
            ease-in-out [box-shadow:0px_0px_57px_9px_rgba(0,0,0,0.4)] hover:scale-110"
          >
            Cancel
          </button>
        </div>
      </form>
      {/* change password */}
      <div className="my-8 pl-4 font-be-veitnam-pro text-4xl lm:pl-10">Password</div>
      <form
        onSubmit={handleSubmitPassword(changePassword)}
        className="relative mx-auto mb-12 flex w-10/12 flex-col items-center gap-8 rounded-2xl bg-[#DD5746] pb-8"
      >
        <label className="ml-8 mt-5 text-xl font-semibold text-white">Change Password</label>
        <div className="mb-5 ml-8 flex flex-col gap-x-8 gap-y-6 md:flex-row">
          <input
            className="rounded-lg bg-black px-4 py-2 text-white outline-none"
            {...registerPassword("oldPassword", {
              required: true,
              pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/,
              minLength: 8,
              maxLength: 20,
            })}
            placeholder="Current Password"
          />
          <input
            className="rounded-lg bg-black px-4 py-2 text-white outline-none"
            {...registerPassword("newPassword", {
              required: true,
              pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/,
              minLength: 8,
              maxLength: 20,
            })}
            placeholder="New Password"
          />
        </div>
        {(errors.oldPassword || errors.newPassword) && (
          <span
            className="absolute top-[12.5rem] mx-auto w-[20rem] text-center text-[0.8rem] text-white 
          md:top-[7.8rem]"
          >
            lowercase, uppercase, digit, special character and Length: min - 8, max - 20
          </span>
        )}
        <button
          type="submit"
          disabled={changingPassword}
          className="mt-8 cursor-pointer rounded-xl bg-white px-10 py-2 text-center text-black transition-all 
          ease-in-out hover:scale-110"
        >
          Change
        </button>
      </form>
    </div>
  );
};

export default Settings;
