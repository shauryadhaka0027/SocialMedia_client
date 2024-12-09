import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../Pages/Login/Login'
import SignUp from '../Pages/SignUp/SignUp'
import { HomePage } from '../Pages/HomePage/HomePage'
import { useZustand } from '../Zustand/useZustand'
import { PrivateRoute } from './PrivateRoute.jsx'
import EditPost from '../Components/EditPost/EditPost.jsx'



const MainRoutes = () => {

  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route   path='/signup' element={<SignUp/>}/>
        <Route element={<PrivateRoute/>}>
        <Route path="/"  element={<HomePage/>}  />
        <Route path='/:id' element={<EditPost/>} />
        </Route>
       
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </div>
  )
}

export default MainRoutes
