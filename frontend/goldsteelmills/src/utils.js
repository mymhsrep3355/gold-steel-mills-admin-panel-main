import {jwtDecode} from "jwt-decode";

export const isTokenValid=(token)=>{
    if(!token) return false;
    const {exp}=jwtDecode(token);
    return exp > Date.now() / 1000;

}
