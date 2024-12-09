import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import smApi from "../../api/smApi";
import { notification } from "antd";

const Login = () => {
   const navigate=useNavigate()
   const [error,setError]=useState("")
    const navigateSignUp=()=>{
      navigate("/signUp")
    }
    const [formData,setFormData]=useState({
      email:"",
      password:""
    })
    const userLogin=useMutation({
      mutationFn:smApi.userLogin
    })
    const onChangeValues=(e)=>{
      const {name,value}=e.target
      setFormData({...formData,[name]:value})
    }

    const onSubmitForm=(e)=>{
      e.preventDefault();
      if(!formData?.email ||!formData?.password){
        alert("Please fill all the fields")
        return

      }
    //   const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
    //   if (!passwordRegex.test(formData?.password)) {
    //    setError("Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, and one digit.")
    //     return;
    // }
      userLogin.mutate(formData,{onSuccess:(data)=>{
        // alert("Login")
        notification.success({
            type:"success",
            message: "Login Successful"
        })
        localStorage.setItem("userData", JSON.stringify({ data: data.data, token: data.token }));
        navigate("/")
        
      },
       onError:(data)=>{
        notification.error({
          type:"error",
          message: data.response?.data?.msg || "Invalid Credentials"
        })
       }
    })
      //  console.log("onSubmitForm",formData)
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="w-[450px] h-[500px] bg-white shadow-lg rounded-lg flex overflow-hidden lg:w-[800px]">
       
        <div className="flex-1 bg-blue-500 text-white flex flex-col justify-center items-center p-8 rounded-l-lg">
          <h1 className="text-4xl font-bold mb-4">Hello, Welcome!</h1>
          <p className="text-lg mb-6">Don't have an account?</p>
          <button className="px-6 py-2 bg-white text-blue-500 font-semibold rounded-md shadow-md hover:bg-gray-100" onClick={navigateSignUp}>
            SignUp
          </button>
        </div>

     
        <div className="flex-1 flex flex-col justify-center items-center p-8">
          <h1 className="text-3xl font-bold mb-6">Login</h1>
          <form className="w-full max-w-[300px]" onSubmit={onSubmitForm}>
           
            <div className="relative w-full mb-4">
              <input
                type="text"
                value={formData?.email}
                name="email"
                onChange={onChangeValues}
                placeholder="Email"
                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
            </div>
         
            <div className="relative w-full mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData?.password}
                onChange={onChangeValues}

                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <i className="bx bxs-lock-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl"></i>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            
            <div className="text-right mb-4">
              <a href="#" className="text-blue-500 text-sm hover:underline">
                Forgot Password?
              </a>
            </div>
           
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>
          <p className="mt-6 text-sm text-gray-500">or login with social platforms</p>
         
           
         
        </div>
      </div>
    </div>
  );
};

export default Login;
