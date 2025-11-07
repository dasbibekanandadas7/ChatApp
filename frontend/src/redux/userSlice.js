import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:"user",
    initialState:{
        userData:null,
        otherUser:null
    },
    reducers:{
        setUserData:(state,action)=>{
           state.userData=action.payload
        },
        setOtherUsers:(state,action)=>{
           state.otherUser=action.payload
        }
    }
})

export const {setUserData,setOtherUsers}=userSlice.actions
export default userSlice.reducer