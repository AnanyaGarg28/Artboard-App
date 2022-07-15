import { useState } from "react";
import { useUser } from "../hooks/useUser";
import { useJWT } from "../hooks/useJWT";
import { AiOutlineEdit, AiOutlineSave } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
export const AccountInfo = ({setVisible})=>{
    const user = useUser();
    console.log(user);
    const [name,setName] = useState(()=>user.userInfo.name);
    const [JWT,setJWT] = useJWT();
    const [editing,setEditing] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async ()=>{
        try {
            const reqObject={
                name
            };
            const body=JSON.stringify(reqObject);
            const response = await fetch(`http://localhost:8080/api/update/${user.userIndex}`,{
                method: "put",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWT}` 
                },
                body,
            }).then(res=>res.json());
            const { token:newJWT } = response;
            setJWT(newJWT);
        } catch (e) {
            console.log(e);
        }
    }

    const handleSignout = ()=>{
        localStorage.removeItem("token");
        navigate('/');
    }

    return (
        <div className="fixed h-screen w-full bg-black bg-opacity-50">
            <div className="flex justify-center h-screen">
                <div className="relative self-center inline-block w-1/3 p-8 bg-white text-center ">
                    <img onClick={()=>{setVisible(false)}} src="./img/x-mark.png" alt="" className="absolute w-6 top-2 right-2 hover:opacity-70" />
                    <div className="flex">
                        <input
                            disabled={!editing}
                            className="self-center my-1 mt-4 text-sm grow placeholder:text-black placeholder:font-normal p-2 border border-slate-300 rounded-md"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Name" />
                        {!editing && <AiOutlineEdit onClick={()=>{setEditing(true)}} className="relative top-1 self-center w-8 h-8 "/>}
                        {editing && <AiOutlineSave onClick={()=>{setEditing(false); handleSubmit();}} className="relative top-1 self-center w-8 h-8 "/>}
                    </div>
                    <button onClick={handleSignout} className="inline-block mt-4 p-2 rounded-md text-sm text-semibold text-white bg-purple-800 hover:opacity-70">Sign Out!</button>
                </div>
            </div>
        </div>
    );
}