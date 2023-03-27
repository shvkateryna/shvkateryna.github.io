import { useState,useEffect } from 'react';

function Registration_form() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    
    function handle_submit(event){
        event.preventDefault();
        alert(`The name you entered was: ${login}`)
    }
 useEffect(()=>{

console.log("Here")
},[])
    return (
        <div>
            <form onSubmit={handle_submit}>
                <label>
                Enter Your login
                <input 
                value={login}
                type="text"
                onChange={(e) => setLogin(e.target.value)} 
                 />
                </label>
                <label>
                Enter You password
                <input onChange={(e)=>setPassword(e.target.value)}  value={password} type="password" />
                </label>
                <input type="submit" value="Submit" />
            </form>

        </div>)
}
export default Registration_form