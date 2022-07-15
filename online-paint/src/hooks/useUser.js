import { useState, useEffect } from 'react';
import { useJWT } from './useJWT';

export const useUser = () => {
    const [JWT] = useJWT();
    const getUserObjectFromJWT = JWT=>{
        const encodedUserData = JWT.split('.')[1];
        return JSON.parse(atob(encodedUserData));
    }
    const [user, setUser] = useState(() => {
        if (!JWT) return null;
        return getUserObjectFromJWT(JWT);
    });
    useEffect(() => {
        if (!JWT) {
            setUser(null);
        } else {
            setUser(getUserObjectFromJWT(JWT));
        }
    }, [JWT]);

    return user;
}
