import { useAppSelector } from "@/store/store";

const UserMenu = () => {
    const user = useAppSelector((state) => state.user.user);

    if (!user) {
        return <div>Error</div>;
    }
    let first;
    let second
    if (!user.imageUrl) {
        first = user.firstName.charAt(0);
        second = user.lastName.charAt(0);
    }
    return (
        <div className="flex justify-evenly items-center mr-8">
            {user.imageUrl ?
                <img className="w-10 h-10 rounded aspect-auto" src={user?.imageUrl as string} alt="Loading..."></img>
                :
                <div className=" bg-richblue-500 text-white w-10 h-10 rounded">
                    <span className=" uppercase text-white text-xs">{first}</span>
                    <span className=" uppercase text-white text-xs">{second}</span>
                </div>
            }

        </div>
    );
};

export default UserMenu;