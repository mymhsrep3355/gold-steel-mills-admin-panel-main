import {jwtDecode} from "jwt-decode";
export const BASE_URL = import.meta.env.VITE_BASE_URL;


export const isTokenValid=(token)=>{
    if(!token) return false;
    const {exp}=jwtDecode(token);
    return exp > Date.now() / 1000;

}
