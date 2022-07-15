import { useState } from "react";
import { useJWT } from "../hooks/useJWT";
import { useNavigate, Link } from 'react-router-dom';

function SignUp(){

    const [JWT, setJWT] = useJWT();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(false);

    const navigate=useNavigate();

    const handleSignup = async ()=>{
        try {
            const reqObject={
                email,
                password,
            };
            const body=JSON.stringify(reqObject);
            const response = await fetch('http://localhost:8080/api/signup',{
                method: "post",
                headers: { "Content-Type": "application/json" },
                body,
            }).then(res=>res.json());
            const { token } = response;
            setJWT(token);
            navigate('/');
            setErrorMessage(false);
        } catch (e) {
            console.log(e);
            setErrorMessage(true);
        }
    }

    return (
        <div className="flex justify-center h-screen bg-violet-100 bg-opacity-70">
            <div className="inline-block self-center bg-white p-12 w-9/12 lg:w-1/2 xl:w-5/12 md:w-2/3 rounded-sm">
                <div className="text-center text-2xl font-sans ">Sign Up</div>
                <div className="text-center mt-2"><span className="text-sm">Already have an account? <Link to='/signin' className=" text-violet-700">Sign In</Link></span></div>
                {errorMessage && <div className="text-center mt-2 text-xs text-red-600">Oops Something Went Wrong!</div>}
                <input
                    className="my-1 mt-4 text-sm placeholder:text-black placeholder:font-normal w-full p-2 border border-slate-300 rounded-md"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email Address" />
                <input
                    className="my-2 text-sm placeholder:text-black placeholder:font-normal w-full p-2 border border-slate-300 rounded-md"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password" />
                <input
                    className="my-1 text-sm placeholder:text-black placeholder:font-normal w-full p-2 border border-slate-300 rounded-md"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password" />
                <button
                    className="w-full text-center rounded-2xl bg-lime-500 text-white p-1 mt-6"
                    disabled={!email || !password || password!==confirmPassword}
                    onClick={handleSignup}>Sign Up</button>
            </div>
        </div>
    );
}
export default SignUp;