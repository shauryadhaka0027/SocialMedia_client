import React, { useEffect, useState } from "react";
import { Modal, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import smApi from "../../api/smApi";

const EditPost = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [post, setPost] = useState(null);
    const [content, setContent] = useState("");
    const navigate =useNavigate()

    const {id}=useParams()
     console.log("idd",id)
    const getUserPost=useMutation({
        mutationFn:smApi.getUserPostById
    })

    const updateUserPost=useMutation({
        mutationFn:smApi.updateUserPost

    })

    const fetchUserPostData=()=>{
        getUserPost.mutate({postId:id},{onSuccess:(data)=>{
            setPost(data?.data)
            setContent(data?.data?.content)
        }})
    }
   useEffect(()=>{
    fetchUserPostData()
   },[id])

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!content.trim()) {
            message.error("Content cannot be empty!");
            return;
        }
        updateUserPost.mutate({postId:id,content},{onSuccess:(data)=>{
            navigate("/")
            setContent("");
        }})
        

    };

    const onClose = () => {
        navigate("/")
    };

    return (
        <Modal
            open={isVisible}
            cl
            footer={null}
            centered

            className="rounded-lg"
        >

            <div className="p-4">
                <h2 className="text-lg font-semibold mb-4 text-center">Edit Post</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="content" className="block font-medium mb-1">
                            Post Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Write your updated post content here..."
                            maxLength={200}
                        ></textarea>
                    </div>


                    <div className="flex justify-end gap-4 mt-4">
                        <Button onClick={onClose} className="bg-gray-300 text-black">
                            Cancel
                        </Button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EditPost;
