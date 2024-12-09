import React from 'react'
import { Navbar } from '../../Components/Navbar/Navbar'
import UserCard from '../../Components/UserCard/UserCard'
import SocialFeed from '../../Components/SocialFeed/SocialFeed'
import { Friend } from '../../Components/SuggestFriend/Friend'


export const HomePage = () => {
  return (
    <>
     <Navbar/>
     <div className='flex  w-full mt-6 flex-col lg:flex-row'>
     <UserCard/>
     <SocialFeed/>
     <Friend/>
     </div>
   

    
    </>
  )
}
