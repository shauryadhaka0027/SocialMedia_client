import React from "react";

const FriendRequestCard = ({ data, onAccept, onReject }) => {
    
    const onAcceptRequest=()=>{
        onAccept(data)
    }
    const onRejectRequest=()=>{
        onReject(data)
    }
  return (
    <div className="flex flex-col p-4 bg-white shadow-md rounded-lg border border-gray-200 ">
      
      <div className="flex justify-center items-center">
        <img
          src={data?.sender?.profilePicture}
          alt=""
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-800">{data?.sender?.username}</h3>
          <p className="text-sm text-gray-500">wants to be your friend</p>
        </div>
      </div>

    
      <div className="flex space-x-2 justify-center p-2">
       
        <button
          onClick={onAcceptRequest}
          className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1"
        >
          Accept
        </button>

   
        <button
          onClick={onRejectRequest}
          className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default FriendRequestCard;
