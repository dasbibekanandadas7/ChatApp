import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUserData,setOtherUsers } from "../redux/userSlice"
import { serverurl } from "../config"

const usegetOtherUser=()=>{
    const dispatch=useDispatch()
    const{userData,otherUser}=useSelector(state=>state.user)

    useEffect(()=>{
        const fetchUser=async()=>{
            try {
                const result=await axios.get(`${serverurl}/api/v2/user/others`,{withCredentials:true})
                dispatch(setOtherUsers(result.data.data))
            } catch (error) {
                console.log("error in getOtheruser custom hook: ",error);
            }
        }
        fetchUser()
    },[userData])
}

export default usegetOtherUser
