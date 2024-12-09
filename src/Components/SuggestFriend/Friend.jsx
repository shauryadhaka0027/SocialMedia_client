import { useMutation } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import smApi from "../../api/smApi";
import { useZustand } from "../../Zustand/useZustand";
import { useContext } from "react";
import { SocketContext } from "../../context/SocketContext";
import useListenNotifications from "../../Hooks/useListenNotifications";
import { LoadingOutlined } from '@ant-design/icons';

export const Friend = () => {
  const [users, setUsers] = useState([]);
  const { userInformation, setUserInformation ,posts, setPosts} = useZustand();
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
        // console.log("userDataget", data.data);
        // const latestUpdate = data.data?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
      newFollowStatus[user?._id] =
        userInformation?.following?.includes(user?._id) || false;
    });
    setFollowStatus(newFollowStatus);
  };

  useEffect(() => {
    if (userInformation?._id) {
      getUserDetailsFunc();
    }
  }, [userInformation?._id]);

  const handleFollowClick = async (userId) => {
    setLoadingUsers((prevState) => ({ ...prevState, [userId]: true })); 

    const isCurrentlyFollowing = followStatus[userId];

    if (isCurrentlyFollowing) {
      userUnfollow.mutate(
        { _id: userInformation?._id, userId: userId },
        {
          onSuccess: () => {
            getUserData();
            getUserPostData()
            setFollowStatus((prevStatus) => ({
              ...prevStatus,
              [userId]: false,
            }));
            setLoadingUsers((prevState) => ({ ...prevState, [userId]: false })); 
          },
          onError: (error) => {
            console.error("Error unfollowing user:", error);
            setLoadingUsers((prevState) => ({ ...prevState, [userId]: false })); 
          },
        }
      );
    } else {
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
            getUserPostData()
            setFollowStatus((prevStatus) => ({
              ...prevStatus,
              [userId]: true,
            }));
            setLoadingUsers((prevState) => ({ ...prevState, [userId]: false })); 
          },
          onError: (error) => {
            console.error("Error following user:", error);
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
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${
                followStatus[user._id]
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              disabled={loadingUsers[user._id]}
            >
              {followStatus[user._id] ? "Unfollow" : "Follow"}
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

