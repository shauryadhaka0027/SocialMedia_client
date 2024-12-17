
import { create } from 'zustand'

export const useZustand = create((set) => ({
    // valid:false,
    // setValid: (valid) => set({ valid }),

    userInformation: {},
    setUserInformation: (userInformation) => set({ userInformation }),

    // notification:[],
    // setNotification:(notification)=>set({notification}),


    notification: [], // Initialize as an empty array
    setNotification: (notifications) =>
    set({ notification: notifications }),



    countNotification: 0,
    setCountNotification: (countNotification) => set({ countNotification }),

     posts:[],
     setPosts:(posts)=>set({posts}),

     isHidden: true,
     setISHidden: (isHidden) => set({ isHidden }),

     followStatus:{},
     setFollowStatus:(followStatus) => set({ followStatus}),

     isAcceptRequest:false,
     setIsAcceptRequest: (isAcceptRequest) => set({ isAcceptRequest }),

     onAcceptUserId:"",
     setOnAcceptUserId: (onAcceptUserId) => set({ onAcceptUserId }),



}));
