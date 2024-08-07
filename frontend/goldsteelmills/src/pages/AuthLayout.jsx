import {Outlet, useNavigate} from 'react-router-dom'
import {useAuthProvider} from "../hooks/useAuthProvider.js";
import {useEffect} from "react";
import {isTokenValid} from "../utils.js";

export const AuthLayout=()=>{
    const navigate= useNavigate()
    const {user,token}=  useAuthProvider()

    useEffect(() =>{
        navigate("/")
    },[])
    // useEffect(()=>{
    //     const isValid=isTokenValid(token)
    //     if(user && isValid){
    //         navigate("/")
    //     }
    // },[user])
    return <div className={'h-[100%]'}>
        <div className={'h-[100%]'}>
            <Outlet/>
        </div>
    </div>
}