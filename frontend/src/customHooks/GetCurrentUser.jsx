import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUserData } from "../redux/userSlice"
import { serverurl } from "../config"

const usegetCurrentUser=()=>{
    const dispatch=useDispatch()
    const{userData}=useSelector(state=>state.user)

    useEffect(()=>{
        const fetchUser=async()=>{
            try {
                const result=await axios.get(`${serverurl}/api/v2/user/currentuser`,{withCredentials:true})
                dispatch(setUserData(result.data.data))
            } catch (error) {
                console.log("error in getCurrentUserData custom hook: ",error);
            }
        }
        fetchUser()
    },[])
}

export default usegetCurrentUser
