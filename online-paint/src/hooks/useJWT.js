import { useState } from "react";

export const useJWT = ()=>{
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token');
    });
    const setJWT = val => {
        localStorage.setItem('token', val);
        setToken(val);
    }
    return [token, setJWT];
}