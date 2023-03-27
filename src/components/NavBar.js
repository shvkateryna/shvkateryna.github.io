import React from 'react'
import { useAuth } from "../contexts/AuthContexts"
import { useNavigate } from "react-router-dom";
const NavBar = () => {
    const { currentUser, role } = useAuth()
    let navigate = useNavigate();
    const routeChange = (path) => {
        navigate("/"+path);
    }
    return (
        <div className="header">
            <div onClick={()=>navigate("/")} className="logo">RooMy</div>
            <div className="button_group">
                <button onClick={() => routeChange("login")} className="header_button-login">Увійти</button>
                {role === "USER" ? <>
                    <button onClick={() => routeChange("rooms_curator")} className="header_button-login">Мої кімнати</button>
                </> : <></>}
                {role === "ADMIN" ? <>
                    <button onClick={() => routeChange("manager")} className="header_button-login">Адмін</button>
                </> : <></>}

            </div>
        </div>
    )
}

export default NavBar