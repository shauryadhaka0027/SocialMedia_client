import React, { useEffect, useState, useMemo, useContext } from 'react';
import { useZustand } from '../../Zustand/useZustand';
import { useMutation } from '@tanstack/react-query';
import smApi from '../../api/smApi';
import { Badge } from 'antd';
import timeAgo from '../../utils/convertIndianTime';
import { SocketContext } from '../../context/SocketContext';
import FriendRequestCard from '../FriendRequestCard/FriendRequestCard';

const Notification = ({ readNotification }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const {socket}=useContext(SocketContext)
    const [showNotification, setShowNotification] = useState([])
    const {
        userInformation,
        notification,
        setNotification,
        countNotification,
        setCountNotification,
        setPosts,
        setUserInformation,
        setIsAcceptRequest,
        setOnAcceptUserId,

    } = useZustand();

    const getNotifications = useMutation({
        mutationFn: smApi.getNotifications
    });

    const fetchNotificationsData = () => {
        if (!userInformation?._id) return;

        getNotifications.mutate(
            { id: userInformation._id },
            {
                onSuccess: (data) => {

                    if (Array.isArray(data?.data)) {
                        setNotification([...notification, ...data?.data]);
                        setCountNotification(data?.data?.length)
                    } else {
                        console.error('Unexpected data format:', data);
                    }
                }
            }
        );
    };
    const acceptRequest = useMutation({
        mutationFn: smApi.acceptRequest
    })
    const getUserPost = useMutation({
        mutationFn: smApi.getUserPost,
    });
    useEffect(() => {
        const latestNotification = notification.slice(-6);
        latestNotification.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setShowNotification(latestNotification)
    }, [notification]);


    useEffect(() => {
        fetchNotificationsData();
    }, [userInformation]);


    const OnClickNotificationIcon = () => {
        readNotification()
        setCountNotification(0)

    }


    const handleAccept = (data) => {
      
        acceptRequest.mutate(
            { _id: data._id },
             
            {
                onSuccess: (response) => {
                    setCountNotification(0);
                    const latestNotification = response?.data;
                    setShowNotification(latestNotification);
                    const notification11={
                        _id:data?._id,
                        sender:data?.sender
                    }
                    getUserPost.mutate(
                        {},
                        {
                            onSuccess: (postData) => {
                                setPosts(postData?.data);
                                setOnAcceptUserId(data?.sender?._id)
                                setIsAcceptRequest(true);
                                setDropdownOpen(!dropdownOpen)
                                socket.emit("Accept",notification11 );
                                setNotification([])

                            },
                        }
                    );

                },
                onError: (error) => {
                    console.error("Error accepting friend request:", error);
                    console.log(error)
                },
            }
        );
    };


    const handleReject = () => {
        alert("Friend request rejected!");
    };

    return (
        <div className="flex justify-center w-auto">
            <div>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="relative z-10 block rounded-md bg-white p-2 focus:outline-none"
                >
                    <Badge count={countNotification} onClick={OnClickNotificationIcon}>
                        <svg
                            className="h-5 w-5 text-gray-800"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                    </Badge>
                </button>

                {dropdownOpen && (
                    <div
                        className="fixed inset-0 h-full w-full z-10"
                        onClick={() => setDropdownOpen(false)}
                    ></div>
                )}

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg overflow-y-auto max-h-[350px] w-80 z-50">
                        {showNotification && showNotification.length > 0 ? (
                            showNotification.map((data) => (
                                <div key={data?._id} className="py-2">
                                    <a className="flex items-center px-4 py-3 border-b hover:bg-gray-100 -mx-2">
                                        <img
                                            className="h-8 w-8 rounded-full object-cover mx-1"
                                            src={data?.sender?.profilePicture || '/default-avatar.png'}
                                            alt="avatar"
                                        />
                                        <div className="text-gray-600 text-sm mx-2 p-1">
                                            {(data?.type === 'follow' && data?.read)&& (
                                                // <>
                                                //     <span className="font-bold">{data?.sender?.username}</span>
                                                //     <span className="text-blue-500 px-1">
                                                //         started following you.
                                                //     </span>
                                                // </>

                                                <FriendRequestCard

                                                    data={data}
                                                    onAccept={handleAccept}
                                                    onReject={handleReject}
                                                />

                                            )}
                                            {data?.type === 'like' && (
                                                <>
                                                    <span className="font-bold">{data?.sender?.username}</span>
                                                    <span className="text-blue-500"> liked your post!</span>
                                                </>
                                            )}
                                            {data?.type === 'comment' && (
                                                <>
                                                    <span className="font-bold">{data?.sender?.username}</span>
                                                    <span className="text-blue-500"> commented on your post.</span>
                                                </>
                                            )}
                                               {data?.accept && (
                                                <>
                                                    <span className="font-bold">{data?.sender?.username}</span>
                                                    <span className="text-blue-500">Friend Request Accept</span>
                                                </>
                                            )}
                                            <p className="flex justify-end font-extrabold">
                                                {timeAgo(data?.createdAt)}
                                            </p>
                                        </div>
                                    </a>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4">No notifications</div>
                        )}
                        <a
                            onClick={() => setDropdownOpen(false)}
                            className="block bg-gray-800 text-white text-center font-bold py-2 cursor-pointer"
                        >
                            Close Notification
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;
