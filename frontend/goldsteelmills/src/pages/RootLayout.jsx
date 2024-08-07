import {Outlet, useNavigate} from 'react-router-dom'
import {Sidebar} from "../components/Sidebar.jsx";
import {useAuthProvider} from "../hooks/useAuthProvider.js";
import {useEffect} from "react";
import axios from "axios";
import {isTokenValid} from "../utils.js";
export const RootLayout=()=>{
    const navigation=useNavigate()
    const {user}=useAuthProvider();
    const {token}=useAuthProvider()

    // useEffect(()=>{
    //     console.log('in root useEffect')
    //     //verify is user is user is present
    //     if(!user){
    //         navigation('/auth/login')
    //     }
    //     //verify if token is valid
    //     const isValid=isTokenValid(token)
    //     console.log(isValid)
    //     if(!isValid){
    //         navigation('/auth/login')
    //     }else
    //         axios.defaults.headers.common['Authorization']=`Bearer ${token}`

    // },[navigation, token, user])
    
    return <div className={'h-[100%]'}>
        <div className={'flex h-[100%]'}>
            <aside className={'bg-white border p-4 flex-grow-0 flex-shrink-0 w-[20%] '}>
                    <Sidebar/>
            </aside>
            <section className={'overflow-scroll bg-gray-100 w-[80%] h-screen p-4 flex-grow-0 flex-shrink-0'}>
                    <Outlet/>
            </section>
    </div>
    </div>
}