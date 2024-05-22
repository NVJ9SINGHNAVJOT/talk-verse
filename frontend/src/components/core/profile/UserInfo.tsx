import { setProfileImage } from "@/redux/slices/userSlice";
import { useAppSelector } from "@/redux/store";
import { setProfileImageApi } from "@/services/operations/profileApi";
import { maxFileSize, validFiles } from "@/utils/constants";
import { useState, useRef } from "react";
import { RxAvatar } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserInfo = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user.user);
  const profile = useAppSelector((state) => state.user.profile);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const handleimgTagRefClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > maxFileSize) {
        toast.info("Max 5mb image file allowed");
        return;
      }
      const fileType = file.type;
      if (validFiles.image.includes(fileType)) {
        setSelectedFile(file);
      } else {
        toast.error("Select .jpg/.jpeg/.png type file");
      }

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  const cancelImage = () => {
    setSelectedFile(null);
  };
  const uploadProfileImage = async () => {
    setUploading(true);
    const tId = toast.loading("Uploading Profile photo", {
      position: "top-center",
    });
    if (selectedFile) {
      const newForm = new FormData();
      newForm.append("imageFile", selectedFile);

      const response = await setProfileImageApi(newForm);

      if (response && response.success === true) {
        dispatch(setProfileImage(response.imageUrl));
        setSelectedFile(null);
      } else {
        toast.error("Error while uploading file");
      }
    } else {
      toast.error("Error while uploading file");
    }
    setSelectedFile(null);
    toast.dismiss(tId);
    setUploading(false);
  };

  const navigate = useNavigate();
  const goSetting = () => {
    navigate("/profile/settings");
  };
  return (
    <div className="w-full">
      <section className=" w-full flex justify-around mt-14 sm:px-4 lm:px-10 sm:flex-col-reverse md:flex-row">
        {/* user Details */}
        <div className=" w-7/12 flex flex-col sm:mt-10 md:mt-6 sm:ml-10 md:ml-6 ">
          <p className=" text-4xl font-semibold font-be-veitnam-pro  mb-14">
            {user?.firstName + " " + user?.lastName}
          </p>
          <p className=" text-xl font-semibold ">Bio</p>
          {profile?.bio ? (
            <p className=" text-[0.9rem]">{profile.bio}</p>
          ) : (
            <p
              className=" text-[0.9rem] cursor-pointer w-fit"
              onClick={goSetting}
            >
              set bio Lorem ipsum dolor sit.
            </p>
          )}

          <p className=" text-xl font-semibold  mt-2">User Name</p>
          <p className=" text-[0.9rem]">{profile?.userName}</p>
          <p className=" text-xl font-semibold  mt-2">Email</p>
          <p className=" text-[0.9rem]">{profile?.email}</p>
          <p className=" text-xl font-semibold  mt-2">Gender</p>
          {profile?.gender ? (
            <p className=" text-[0.9rem]">{profile.gender}</p>
          ) : (
            <p
              className=" text-[0.9rem] cursor-pointer w-fit"
              onClick={goSetting}
            >
              set gender
            </p>
          )}
          <p className=" text-xl font-semibold  mt-2">Contact No.</p>
          {profile?.contactNumber ? (
            <p className=" text-[0.9rem] sm:mb-8 md:mb-0">
              {profile.contactNumber}
            </p>
          ) : (
            <p
              className=" text-[0.9rem] cursor-pointer sm:mb-8 md:mb-0 w-fit"
              onClick={goSetting}
            >
              set contact no.
            </p>
          )}
        </div>
        {/* user Image */}
        <div className=" relative flex flex-col gap-10  w-56">
          <input
            type="file"
            accept=".jpg ,.jpeg, .png"
            ref={imageInputRef}
            onChange={handleImageChange}
            className=" absolute w-1 h-1 hidden -z-10"
          />
          <div
            className=" bg-black  w-full rounded-xl flex justify-center items-center
        [box-shadow:0px_0px_57px_9px_rgba(0,0,0,0.4)] hover:scale-110 transition-all ease-in-out
         sm:mx-auto md: mx-0"
          >
            {selectedFile ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Loading..."
                className=" w-full h-64 aspect-auto "
              />
            ) : user?.imageUrl ? (
              <img
                src={user?.imageUrl}
                alt="Loading..."
                className=" w-full h-64 aspect-auto "
              />
            ) : (
              <RxAvatar className=" w-full h-64 aspect-auto text-white" />
            )}
          </div>
          {selectedFile && !uploading ? (
            <div className=" flex justify-center gap-4">
              <button
                onClick={uploadProfileImage}
                className="[box-shadow:0px_0px_57px_9px_rgba(0,0,0,0.4)] hover:scale-110 transition-all ease-in-out
           bg-black  px-6 w-fit py-2 self-center rounded-xl text-white mt-8
            text-center cursor-pointer"
                type="submit"
              >
                Upload
              </button>
              <button
                onClick={cancelImage}
                className="[box-shadow:0px_0px_57px_9px_rgba(0,0,0,0.4)] hover:scale-110 transition-all ease-in-out
           bg-white px-6 w-fit py-2 self-center rounded-xl text-black mt-8
            text-center cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleimgTagRefClick}
              disabled={uploading}
              className="[box-shadow:0px_0px_57px_9px_rgba(0,0,0,0.4)] hover:scale-110 transition-all ease-in-out
           bg-black  px-6 w-fit py-2 self-center rounded-xl text-white mt-8
            text-center cursor-pointer"
              type="submit"
            >
              Update
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default UserInfo;
