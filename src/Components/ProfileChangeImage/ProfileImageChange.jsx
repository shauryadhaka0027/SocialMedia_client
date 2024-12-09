// import React, { useState } from 'react';
// import { Modal, Upload, message } from "antd";

// export const ProfileImageChange = ({ id,profileUpdate }) => {
//     const [isModalVisible, setIsModalVisible] = useState(true);

//     const getExtraData = (file) => ({
//         fileUidName: file.uid,
//         _id: id,
//     });

//     const uploadContactPersonData = {
//         name: "profilePicture",
//         action: "http://localhost:3000/api/upload",
//         data: getExtraData,
//         onChange(info) {
//             if (info.file.status === 'done') {
//                 message.success(`${info.file.name} file uploaded successfully`);
//                 profileUpdate(info.file.status)
//             } else if (info.file.status === 'error') {
//                 message.error(`${info.file.name} file upload failed.`);
//             }
//         }
//     };

//     const handleCloseModal = () => {
//         setIsModalVisible(false);
//     };

//     return (
//         <>
//             <Modal
//                 open={isModalVisible}
//                 onCancel={handleCloseModal}
//                 footer={null}
//                 className="p-4 rounded-lg shadow-lg bg-white" 
//             >  
//             <h1></h1>
//                 <div className="flex justify-center items-center">
//                     <Upload
//                         className="uploadimage"
//                         listType="picture-card"
//                         maxCount={1}
//                         {...uploadContactPersonData}
//                     >
//                         <div className="flex justify-center items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer">
//                             <span className="text-blue-500 text-lg">+ Upload</span>
//                         </div>
//                     </Upload>
//                 </div>
//             </Modal>
//         </>
//     );
// };


import React, { useState } from "react";
import { Modal, Upload, message } from "antd";

export const ProfileImageChange = ({ id, profileUpdate }) => {
  const [isModalVisible, setIsModalVisible] = useState(true);

  const getExtraData = (file) => ({
    fileUidName: file.uid,
    _id: id,
  });

  const uploadContactPersonData = {
    name: "profilePicture",
    action: "http://localhost:3000/api/upload",
    data: getExtraData,
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        profileUpdate(info.file.status);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        className="profile-modal" 
      >
        <h1 className="text-center text-xl font-bold text-gray-800 mb-4">
          Change Your Profile Picture
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Upload a new profile picture to personalize your account. Make sure
          your photo is clear and friendly!
        </p>
        <div className="flex justify-center items-center">
          <Upload
            className="uploadimage"
            listType="picture-card"
            maxCount={1}
            {...uploadContactPersonData}
          >
            <div className="upload-area">
              <span className="upload-text">+ Upload Image</span>
            </div>
          </Upload>
        </div>
      </Modal>
    </>
  );
};
