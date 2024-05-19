import { setMyPrivateKey } from "@/redux/slices/messagesSlice";
import { useAppSelector } from "@/redux/store";
import {
  decryptPMessage,
  encryptPMessage,
} from "@/utils/encryptionAndDecryption";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type Key = {
  key: string;
};

const checkMessage = process.env.TEST_P_KEY as string;
const ChekKey = () => {
  const myPublicKey = useAppSelector((state) => state.user.user?.publicKey);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<Key>();

  const checkKey = (data: Key) => {
    setLoading(true);
    const tId = toast.loading("Validating key", {
      position: "top-center",
    });
    reset();

    if (!myPublicKey) {
      navigate("/login");
      return;
    }
    if (!data.key) {
      toast.info("Enter your private key");
      return;
    }

    try {
      const completeKey =
        "-----BEGIN RSA PRIVATE KEY-----" +
        data.key +
        "-----END RSA PRIVATE KEY-----";
      const encryptMessage = encryptPMessage(checkMessage, myPublicKey);
      const decryptedMessage = decryptPMessage(encryptMessage, completeKey);
      if (!decryptedMessage || checkMessage !== decryptedMessage) {
        toast.error("Invalid private key, please enter valid key");
      } else {
        dispatch(setMyPrivateKey(completeKey));
        toast.dismiss(tId);
        navigate("/talk");
        return;
      }
    } catch (error) {
      toast.error("Invalid Key, please enter correct private key");
    }
    toast.dismiss(tId);
    setLoading(false);
  };
  return (
    <form
      onSubmit={handleSubmit(checkKey)}
      className="ct-checkPgBack flex flex-col items-center justify-center w-full h-[calc(100vh-4rem)] gap-8 "
    >
      <h2 className=" font-be-veitnam-pro text-3xl font-semibold text-white">
        Enter Your{" "}
        <span className=" text-black font-extrabold">Private Key</span>
      </h2>
      <input
        type="text"
        className=" w-7/12 h-16 rounded-lg text-[14px] font-medium
       bg-[#53535f] text-[#fff] border-[2px]
         transition-all ease-in-out outline-none
        border-[rgba(255,255,255,0.16)]
        hover:border-[#a970ff] hover:bg-[#0e0e10] hover:outline-none
         focus:outline-none focus:border-[#a970ff] focus:bg-[#0e0e10]
          px-4"
        {...register("key", {
          required: true,
          minLength: 1,
        })}
      />
      <button
        disabled={loading}
        className=" text-center  bg-slate-50 rounded-lg py-2 px-8 font-semibold"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default ChekKey;
