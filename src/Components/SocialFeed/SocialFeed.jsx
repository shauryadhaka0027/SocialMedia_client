import React, { useEffect, useState } from "react";
import { IoIosImage, IoIosHappy, IoMdMore } from "react-icons/io";
import { AiOutlineLike, AiOutlineComment } from "react-icons/ai";
import { useZustand } from "../../Zustand/useZustand";
import { useMutation } from "@tanstack/react-query";
import smApi from "../../api/smApi";
import { IoSend } from "react-icons/io5";
import { notification } from "antd";
import { PopConfirm } from "../popConfirm/PopConfirm";
import useListenNotifications from "../../Hooks/useListenNotifications";
import { useContext } from "react";
import { SocketContext } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom";



const SocialFeed = () => {

  const { userInformation } = useZustand();
  useListenNotifications()
  const [content, setContent] = useState("");
  const [commentContent,setCommentContent] = useState("")
  const [profileImage, setProfileImage] = useState(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const { posts, setPosts } = useZustand();
  const { socket } = useContext(SocketContext)
  const [postUserId, setPostUserId] = useState(null);
  const [postId, setPostId] = useState(null);
  const [isShowMenu, setIsShowMenu] = useState(false)
  const navigate = useNavigate()


  const userPost = useMutation({
    mutationFn: smApi.userPost,
  });
  const getUserPost = useMutation({
    mutationFn: smApi.getUserPost,
  });
  const getLikesPost = useMutation({
    mutationFn: smApi.getLikesPost,
  });
  const getCommentsPost = useMutation({
    mutationFn: smApi.getCommentsPost,
  });
  const deleteUserPost = useMutation({
    mutationFn: smApi.deleteUserPost
  })

  const getUserPostData = () => {
    getUserPost.mutateAsync({userId:userInformation?._id}, {
      onSuccess: (data) => {
        // console.log("userDataget", data.data);
        // const latestUpdate = data.data?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(data?.data);
      },
    });
  };


  const onChangeValue = (e) => {
    const { value } = e.target;
    setContent(value);
    
  };

  const onChangeValueComment=(e)=>{
    const { value } = e.target;
    setCommentContent(value)
  }

  const onSubmitForm = (e) => {
    e.preventDefault();

    if (!content.trim()) {
      return alert("Please enter some content!");
    }

    const formData = new FormData();
    formData.append("user", userInformation?._id);
    formData.append("content", content);

    if (profileImage) {
      formData.append("profilePicture", profileImage);
    }

    userPost.mutateAsync({ user: userInformation?._id, content, profilePicture: profileImage }, {
      onSuccess: () => {
        // alert("Form submitted successfully!");
        getUserPostData();
      },
      onError: (error) => {
        console.error("Error:", error);
        alert("Failed to submit the post. Please try again.");
      },
    });

    setContent("");
    setProfileImage(null);
  };


  const onFeedLikes = (post) => {

    getLikesPost.mutateAsync(
      { postId: post._id, userId: userInformation?._id },
      {
        onSuccess: (data) => {
          const data2 = {
            postUserId: post?.user?._id,
            sender: userInformation?._id,
            postId: post._id,
          };
        
          if ((data?.data?.likes?.includes(userInformation?._id))) {
            if (data?.data?.user !== userInformation?._id) {
              console.log("no like", data?.data?.likes?.includes(userInformation?._id))
              socket.emit("like", data2);
            }
          }
          notification.success({
            type: "success",
            message: data.msg,
          });
          getUserPostData();
        },
        onError: (err) => {
          notification.error({
            type: "error",
            message: err?.response?.data?.msg || "An error occurred",
          });
        },
      }
    );
  };



  const toggleCommentBox = (post) => {

    setPostUserId(post?.user)
    setPostId(post)
    setActiveCommentPostId((prevPostId) => (prevPostId === post?._id ? null : post?._id));


  };

  const onSubmitComments = (e) => {
    e.preventDefault();
    const dataObj = {
      userId: userInformation?._id,
      content: commentContent,
      postId: activeCommentPostId,
    };
    const data2 = {
      postUserId: postUserId?._id,
      sender: userInformation?._id,
      postId: postId?._id,
    };
    getCommentsPost.mutateAsync(dataObj, {
      onSuccess: (data) => {

        if (data?.data?.comments.length > 0) {
          const lastArr = data?.data?.comments
          const lastComment = lastArr[lastArr.length - 1]
          if (lastComment?.user !== data?.data?.user) {
            socket.emit("comment", data2);
            
          }
        }
     
        notification.success({
          type: "success",
          message: data.msg,
        });
        toggleCommentBox(null);
        setContent("")
        setCommentContent("")
        getUserPostData();
      },
    });
  };



  const handleDelete = (data) => {
    deleteUserPost.mutate({ postId: data }, {
      onSuccess: (data) => {
        getUserPostData();
        notification.success({
          type: "success",
          message: "Succesfully deleted",
        });

      },
      onError: (err) => {
        notification.error({
          type: "error",
          message: err?.response?.data?.msg || "An error occurred",
        });
      }
    })
    // getUserPostData();
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // console.log("fillllle",file);
    if (file) {
      setProfileImage(file);
    }
  };


  useEffect(() => {
    getUserPostData();
  }, []);


  return (
    <div className="w-[100%] md:w-[45%] mx-auto bg-gray-50 p-4  h-[84vh]">
      {/* Post Form */}
      <div className="bg-white shadow-lg w-auto rounded-lg p-4 mb-6">
        <form onSubmit={onSubmitForm}>
          <div className="flex items-start gap-4">
            <img
              src={userInformation?.profilePicture}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-grow">
              <input
                type="text"
                placeholder="What's going on"
                name="content"
                value={content}
                onChange={onChangeValue}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex mx-4 items-center gap-4 text-gray-500">
              <label htmlFor="profilePicture">
                <IoIosImage size={20} className="cursor-pointer hover:text-blue-500" />
              </label>
              <input
                type="file"
                name="profilePicture"
                id="profilePicture"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {/* <IoIosHappy size={20} className="cursor-pointer hover:text-blue-500" /> */}
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
              Post it
            </button>
          </div>
        </form>
        {profileImage && (
          <img
            src={URL.createObjectURL(profileImage)}
            alt="Profile"
            className="w-full mt-2 object-cover"
          />
        )}
      </div>


      <div className="h-[59vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 p-2">
        {posts?.map((post) => (
          <div key={post._id} className="bg-white shadow-lg rounded-lg p-4 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={post?.user?.profilePicture}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold">{post?.user?.username}</h4>
                  <p className="text-xs text-gray-400">{post?.user?.bio}</p>
                </div>
              </div>




              <div className="relative  ">

                {post?.user?._id === userInformation?._id && (
                  <IoMdMore
                    size={24}
                    className="text-gray-500 cursor-pointer hover:text-blue-500 transition-all"
                    onClick={() => setIsShowMenu(isShowMenu === post._id ? null : post._id)}
                  />
                )}

                <div>
                  {isShowMenu === post._id && (
                    <div className="absolute right-0 top-6 w-24 p-2  bg-white shadow-lg rounded-lg border border-gray-200">
                      <PopConfirm
                        handleDelete={handleDelete}
                        data={post}
                        className="w-full cursor-pointer hover:bg-red-50 hover:text-red-500"
                      />
                      <div
                        className="w-full  cursor-pointer hover:bg-blue-50 hover:text-blue-500"
                        onClick={() => {
                          navigate(`/${post._id}`)

                        }}
                      >
                        Edit


                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
            <p className="mt-4 px-4 py-2 text-sm text-gray-600">{post.content}</p>
            {post?.image && (
              <div>
                <img src={post?.image} alt="" />
              </div>
            )}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-6 text-gray-500">
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                  onClick={() => onFeedLikes(post)}
                >
                  <AiOutlineLike />
                  {post?.likes.length}
                </div>
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-blue-500"
                  onClick={() => toggleCommentBox(post)}
                >
                  <AiOutlineComment />
                  <span className="text-xs">Comments</span>
                </div>
              </div>
            </div>
            {activeCommentPostId === post._id && (
              <div className="bg-white shadow-lg w-auto rounded-lg p-4 mt-4">

                <form onSubmit={onSubmitComments}>
                  <div className="flex items-start gap-4">
                    <img
                      src={userInformation?.profilePicture}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-grow">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        name="comment"
                        value={commentContent}
                        onChange={onChangeValueComment}
                        className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button className="px-4 py-2 text-black rounded-lg text-sm -mx-2 border-2 border-black">
                      <IoSend size={20} />
                    </button>
                  </div>
                </form>

                {post.comments.map((comment) => (
                  <div key={comment._id} className="flex items-start gap-4 mt-4">
                    <img
                      src={userInformation?.profilePicture}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold">{userInformation?.username}</h4>
                      <p className="text-xs text-gray-600">{comment?.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

};

export default SocialFeed;
