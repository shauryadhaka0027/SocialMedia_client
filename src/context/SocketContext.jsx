import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useZustand } from "../Zustand/useZustand";

// Socket Context to manage socket connection
export const SocketContext = createContext();
export const socketURL = import.meta.env.VITE_Current_API;


export const SocketContextProvider = ({ children }) => {
    const { userInformation } = useZustand();
    const [socket, setSocket] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
  
    useEffect(() => {
      if (userInformation?._id) {
      
        const socketInstance = io(socketURL, {
          query: { userId: userInformation?._id },
        });
  
        setSocket(socketInstance);
  
       
        socketInstance.on("getOnlineUsers", (users) => {
          // console.log("Online users:", users);
          setOnlineUser(users);
        });
  
      
        return () => {
          socketInstance.close();
        };
      }
    }, [userInformation]);
  
    return (
      <SocketContext.Provider value={{ socket, onlineUser }}>
        {children}
      </SocketContext.Provider>
    );
  };
  