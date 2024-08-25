import {useContext} from "react";
import {Auth} from "../services/AuthProvider.jsx";

export const useAuthProvider=()=>{
    return useContext(Auth)
}