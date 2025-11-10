import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUserData,setOtherUsers } from "../redux/userSlice"
import { serverurl } from "../config"
import { setMessages } from "../redux/messageSlice"

const usegetMessage=()=>{
    const dispatch=useDispatch()
    const{userData,otherUser, selectedUser}=useSelector(state=>state.user)

    useEffect(()=>{
        if (!selectedUser?._id) dispatch(setMessages(null));
        const fetchMessage=async()=>{
            try {
                const result=await axios.get(`${serverurl}/api/v2/message/get/${selectedUser._id}`,{withCredentials:true})
                dispatch(setMessages(result.data.data))
            } catch (error) {
                console.log("error in getMessage custom hook: ",error);
            }
        }
        fetchMessage()
    },[selectedUser,userData])
}

export default usegetMessage
