import React from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { useDispatch } from "react-redux"
import { setUserData } from '../redux/userSlice'

function useGetCurrentUser() {
    const dispatch = useDispatch()
  useEffect(()=>{
    const getCurrentUser=async()=>{
        try {
            const result = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/me`,{
                withCredentials:true
            })
            console.log("Get-current-user",result)
            dispatch(setUserData(result.data))
        } catch (error) {
            console.log(error)
        }
    }
    getCurrentUser()
  },[])
}

export default useGetCurrentUser
