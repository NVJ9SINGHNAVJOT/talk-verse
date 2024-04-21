import { useAppSelector } from "@/store/store";
import { useState } from "react";

const UserMenu = () => {
    const user = useAppSelector((state) => state.user.user);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const toggleMenu = () => { setMenuOpen((prev) => !prev) };

    if (!user) {
        return <div>Error</div>;
    }

    let first;
    let second;
    if (!user.imageUrl) {
        first = user.firstName.charAt(0);
        second = user.lastName.charAt(0);
    }
    return (
        <div className="flex justify-evenly items-center mr-8">
            {user.imageUrl ?
                <img className="w-10 h-10 rounded aspect-auto" src={user?.imageUrl as string} alt="Loading..."></img>
                :
                <div className=" relative">

                    <div onClick={toggleMenu} className=" peer bg-richblue-500 text-white w-10 h-10 rounded flex 
                    cursor-pointer justify-center items-center gap-1 hover:bg-transparent"
                    >
                        <span className=" uppercase text-white text-xl">{first}</span>
                        <span className=" uppercase text-white text-xl">{second}</span>
                    </div>

                    {/* drop down menu */}
                    <div className={`${menuOpen ? 'block' : 'hidden'} flex flex-col justify-start z-50`}>
                        <div>Profile</div>
                        <div>Settings</div>
                        <div>Log Out</div>
                    </div>

                </div>
            }

        </div>
    );
};

export default UserMenu;