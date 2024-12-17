import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { useZustand } from "../Zustand/useZustand";

const useListenNotifications = () => {
    const { socket } = useContext(SocketContext);
    const { setNotification, notification, userInformation ,setCountNotification,countNotification} = useZustand();
    //  console.log("notificationRecipientsId,",notificationRecipientsId)
    useEffect(() => {
      if (socket && userInformation?._id) {
        const eventName = `notification_${userInformation?._id}`;
        // console.log(`Listening for event: ${eventName}`);
  
        socket.on(eventName, (newNotification) => {
          console.log("Received notification:", newNotification);
          setCountNotification(countNotification + 1)
        
          setNotification([...notification,newNotification])
        });
  
        return () => {
          socket.off(eventName);
        };
      }
    }, [socket, setNotification,notification]);
  
    return { notification };
  };
  
  export default useListenNotifications;
  