import { useMutation } from "@tanstack/react-query";
import React, { useState, useEffect, useContext } from "react";
import smApi from "../../api/smApi";
import { useZustand } from "../../Zustand/useZustand";
import { SocketContext } from "../../context/SocketContext";
import useListenNotifications from "../../Hooks/useListenNotifications";
import { LoadingOutlined } from "@ant-design/icons";


export const Friend = () => {
  const [users, setUsers] = useState([]);
  const {
    userInformation,
    setUserInformation,
    posts,
    onAcceptUserId,
    setPosts,
    isAcceptRequest,
    notification,
    setIsAcceptRequest,
  } = useZustand();
  const [followStatus, setFollowStatus] = useState({});
  const [loadingUsers, setLoadingUsers] = useState({});
  useListenNotifications();
  const { socket } = useContext(SocketContext);

  const { mutateAsync: fetchUserDetails, isLoading } = useMutation({
    mutationFn: smApi.getUserDetails,
  });
  

  const getUserPost = useMutation({
    mutationFn: smApi.getUserPost,
  });

  const addFollowing = useMutation({
    mutationFn: smApi.addFollowing,
  });

  const userUnfollow = useMutation({
    mutationFn: smApi.userUnfollow,
  });

  const getUserDetailsById = useMutation({
    mutationFn: smApi.getUserDetailsById,
  });

  const getUserPostData = () => {
    getUserPost.mutateAsync({}, {
      onSuccess: (data) => {
        setPosts(data?.data);
      },
    });
  };

  const getUserData = () => {
    getUserDetailsById.mutate(
      { _id: userInformation?._id },
      {
        onSuccess: (data) => {
          localStorage.setItem("userData", JSON.stringify(data));
          setUserInformation(data?.data);
        },
        onError: (error) => {
          console.error("Error fetching user details:", error);
        },
      }
    );
  };

  const getUserDetailsFunc = async () => {
    try {
      if (userInformation?._id) {
        const data = await fetchUserDetails({ userId: userInformation?._id });
        setUsers(data?.data || []);
        checkUserStatus(data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const checkUserStatus = (fetchedUsers) => {
    const newFollowStatus = {};
   
    fetchedUsers.forEach((user) => {
      const isFollowing = userInformation?.following?.find(
        (f) => f.userId === user._id
      );
      const isFollower = userInformation?.followers?.find(
        (f) => f.userId === user?._id
      );

      if (isFollowing) {
        newFollowStatus[user._id] = isFollowing?.status || "follow";
      } else if (isFollower) {
        newFollowStatus[user._id] = isFollower?.status || "follow";
      } else {
        newFollowStatus[user._id] = "unFollow";
      }
    });

    setFollowStatus(newFollowStatus);
  };


  useEffect(()=>{
    notification?.map((data)=>{
       if(data.accept){
          setFollowStatus((prevStatus) => {
           const updatedStatus = { ...prevStatus };
           delete updatedStatus[data?.postUserId];
           return {
             ...updatedStatus,
             [data?.postUserId]: "follow",
           };
          
         });
         getUserPostData()
       }
     })
  },[notification.length])



  useEffect(() => {
    const handleAcceptRequest = async () => {
      if (isAcceptRequest) {
        try {
          if (followStatus[onAcceptUserId]) {
            setFollowStatus((prevStatus) => {
              const updatedStatus = { ...prevStatus };
              delete updatedStatus[onAcceptUserId];
              return {
                ...updatedStatus,
                [onAcceptUserId]: "follow",
              };
        
            });
          }
        } catch (error) {
          console.error("Error while handling accept request:", error);
        }
      }
    };

    handleAcceptRequest();
  }, [isAcceptRequest]);


  useEffect(() => {
    if (userInformation?._id) {
      getUserDetailsFunc()
    }

  }, [userInformation?._id])

  const handleFollowClick = async (userId) => {
    setLoadingUsers((prevState) => ({ ...prevState, [userId]: true }));
  
    const isCurrentlyFollowing = followStatus[userId];
  
    if (isCurrentlyFollowing === "pending") {
      userUnfollow.mutate(
        { _id: userInformation?._id, userId: userId },
        {
          onSuccess: () => {
            getUserData();
            getUserPostData();
            setFollowStatus((prevStatus) => ({
              ...prevStatus,
              [userId]: "unFollow",
            }));
            setLoadingUsers((prevState) => ({ ...prevState, [userId]: false }));
          },
          onError: (error) => {
            console.error("Error unfollowing user:", error);
            setLoadingUsers((prevState) => ({ ...prevState, [userId]: false }));
          },
        }
      );
      return;
    }
  
    if (isCurrentlyFollowing === "unFollow") {
      addFollowing.mutate(
        { _id: userInformation?._id, userId },
        {
          onSuccess: () => {
            if (socket) {
              socket.emit("follow", {
                postUserId: userId,
                sender: userInformation?._id,
              });
            }
            getUserData();
            getUserPostData();
            setFollowStatus((prevStatus) => ({
              ...prevStatus,
              [userId]: "pending",
            }));
            setLoadingUsers((prevState) => ({ ...prevState, [userId]: false }));
          },
          onError: (error) => {
            console.error("Error following user:", error);
            setLoadingUsers((prevState) => ({ ...prevState, [userId]: false }));
          },
        }
      );
    } else {
      userUnfollow.mutate(
        { _id: userInformation?._id, userId: userId },
        {
          onSuccess: () => {
            getUserData();
            getUserPostData();
            setFollowStatus((prevStatus) => ({
              ...prevStatus,
              [userId]: "unFollow",
            }));
  
            setLoadingUsers((prevState) => ({ ...prevState, [userId]: false }));
          },
          onError: (error) => {
            console.error("Error unfollowing user:", error);
            setLoadingUsers((prevState) => ({ ...prevState, [userId]: false }));
          },
        }
      );
    }
  };
  
 
  return (
    <div className="w-[25%] hidden md:block mx-auto bg-gray-50 p-4 rounded-lg max-h-[550px] mb-4">
      <h2 className="text-xl font-bold mb-4">Friends</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="max-h-[470px] overflow-y-auto p-4 bg-[#f2f2f2] rounded-lg shadow-md mb-4">
          {users.map((user) => (

            <div
              key={user._id}
              className="flex items-center justify-between bg-white p-4 shadow-md rounded-lg mb-4 hover:shadow-lg transition duration-300 ease-in-out"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user?.profilePicture}
                  alt={`${user.username}'s profile picture`}
                  className="w-14 h-14 rounded-full border-2 border-gray-300 object-cover"
                />
                <p className="text-sm font-semibold text-gray-700 truncate">
                  {user?.username}
                </p>
              </div>

              <button
                onClick={() => handleFollowClick(user._id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${followStatus[user._id] === "pending"
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : followStatus[user._id] === "unFollow"
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                disabled={loadingUsers[user._id]}
              >
                {followStatus[user._id] === "pending"
                  ? "Pending"
                  : followStatus[user._id] === "unFollow"
                    ? "Follow"
                    : "UnFollow"}

                {loadingUsers[user._id] && (
                  <span className="animate-spin">
                    <LoadingOutlined />
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
