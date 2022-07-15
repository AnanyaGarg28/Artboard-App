import { useState } from "react";
import { useJWT } from "../hooks/useJWT";
import { useUser } from "../hooks/useUser";

export const EnterInfo = ()=>{
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [dob, setDob] = useState("");
    const [JWT,setJWT] = useJWT();
    const [errorMessage, setErrorMessage] = useState(false);
    const user = useUser();

    const handleSubmit = async ()=>{
        try {
            const reqObject={
                name,
                age,
                dob
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
            setErrorMessage(false);
        } catch (e) {
            console.log(e);
            setErrorMessage(true);
        }
    }
    return(
        <div>
            {
                errorMessage && 
                <div>Oops Something Went Wrong!</div>
            }
            <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name" />
            <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="Enter your age" />
            <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                placeholder="Enter your dob" />
            <button onClick={handleSubmit}>Submit!</button>
        </div>
    );
}