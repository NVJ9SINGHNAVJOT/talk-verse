import { socketApi } from "@/services/operations/authApi";
import { SocketApiRs } from "@/types/apis/authApiRs";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextInterface {
    socket: Socket | null;
    setSocket: Dispatch<SetStateAction<Socket | null>>;
    setupSocketConnection: () => Promise<Socket>;
    // eslint-disable-next-line no-unused-vars
    disconnectSocket: () => void;
}

type ContextProviderProps = {
    children?: ReactNode
}

const SocketContext = createContext<SocketContextInterface | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = (): SocketContextInterface => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocketContext must be used within a SocketProvider');
    }
    return context;
};

export let newSocket: Socket;

export default function SocketProvider({ children }: ContextProviderProps) {

    const [socket, setSocket] = useState<Socket | null>(null);

    const setupSocketConnection = async (): Promise<Socket> => {
        try {
            const user: SocketApiRs = await socketApi(); // Define socketApi function

            if (!user || !user.userId || user.success === false) {
                throw Error("error while connecting socket");
            }

            const socketInstance = io(process.env.REACT_APP_BASE_URL_SOCKET_IO_SERVER1 as string, {
                withCredentials: true,
                autoConnect: false,
                extraHeaders: {
                    Authorization: user.userId,
                    Api_Key: process.env.SERVER1_KEY as string,
                },
            });

            socketInstance.connect();
            newSocket = socketInstance;
            return socketInstance;
            
        } catch (error) {
            throw Error("error while connecting socket");
        }
    };

    const disconnectSocket = (): void => {
        newSocket.disconnect();
        setSocket(null);
    };

    return (
        <SocketContext.Provider value={{ socket, setSocket, setupSocketConnection, disconnectSocket }}>
            {children}
        </SocketContext.Provider>
    );
}