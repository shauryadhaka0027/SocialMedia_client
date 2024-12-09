import React from 'react'
import { Button, message, Popconfirm } from 'antd';
import { IoMdMore } from "react-icons/io"
import { useMutation } from '@tanstack/react-query';
import smApi from '../../api/smApi';

export const PopConfirm = ({ handleDelete, data }) => {

  const confirm = (e) => {
    console.log(e);
    handleDelete(data?._id)

  };
  const cancel = (e) => {
    console.log(e);
    // message.error('Click on No');
  };

  return (
    <div key={data?._id}>
      <Popconfirm
        title="Delete the task"
        description="Are you sure to delete this Post?"
        onConfirm={confirm}
        key={data?._id}
        onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >

        <span className='text-red-500 cursor-pointer'>Delete</span>
      </Popconfirm>
    </div>

  )
}
