import React from 'react'
import { useAuth } from "../contexts/AuthContexts";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Select from 'react-select'
import { MultiSelect } from "react-multi-select-component"
import '../styles/Manager.css'
import '../styles/Main.css'
import Map from "../components/Map"
import NavBar from './NavBar';

const Curator_menager = () => {
    const { role } = useAuth()
    let navigate = useNavigate();
    const routeChange = (path) => {
        navigate(path);
    }
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [create_new, setCreate_new] = useState(false)
    // Form
    const [error, setError] = useState("")
    const [role_new, setRole_new] = useState("")
    const [wing, setWing] = useState("")
    const [login_new, setLogin_new] = useState([])
    const [password_new, setPassword_new] = useState([])
    const { signup } = useAuth()
    const options = [
        { value: "201-218", label: "201-218" },
        { value: "219-234", label: "219-234" },
        { value: "301-318", label: "301-318" },
        { value: "319-334", label: "319-334" },
        { value: "401-418", label: "401-418" },
        { value: "419-434", label: "419-434" },
        { value: "501-518", label: "501-518" },
        { value: "519-534", label: "519-534" },
    ];
    const [selected, setSelected] = useState([]);
    useEffect(() => {
        setLoading(true)
        axios.get(`http://localhost:5000/curators`)
            .then(res => {
                console.log(res.data)
                setResponse(res.data)
                setLoading(false)
            }).catch(err => {
                console.log(err)
                setLoading(false)
            })
    }, []);
    const create_new_user = (e) => {
        e.preventDefault()
        if (login_new === "") {
            setError("New login is empty")
            return
        } else if (password_new === "") {
            setError("New password is empty")
            return
        }
        let rooms =""
        for (let elem of selected){
            rooms+=elem.value+","
        }
        signup(login_new, password_new, role_new, rooms)
    }
    return (
        <div>
            <NavBar />
            <div className='add_curator_div'>
                <button className='button_add_curator' onClick={() => setCreate_new((prev)=>!prev)}>{create_new?"-":"+"}</button>
                <label className='add_curator'>Додати куратора</label>
            </div>
            {create_new ? <>
                {error ? <>
                    <div>{error}</div>
                </> : <></>}
                <form className='form_add_curator' onSubmit={(e) => create_new_user(e)}>
                    <div>
                        <label>Корпоративна пошта куратора</label>
                        <p><input classname="info_curator" type="text" value={login_new} onChange={(e) => setLogin_new(e.target.value)} /></p>
                    </div>
                    <div>
                        <label>Пароль</label>
                        <p><input classname="info_curator" type="password" value={password_new} onChange={(e) => setPassword_new(e.target.value)} /></p></div>
                    <div>
                        <MultiSelect className='multiselect'
                            options={options}
                            value={selected}
                            onChange={setSelected}
                        />
                    </div>
                    <div>
                        <label>Оберіть статус</label>
                        <p><select key={"_select_"} value={role_new} className="select_owner"
                            onChange={(e) => setRole_new(e.target.value)}>
                            <option key={"role_1"} value={"ADMIN"}>Адмін</option>
                            <option key={"role_2"} value={"USER"}>Куратор</option>
                        </select></p>
                    </div>
                    <div><input className='submit_curator' type="submit" value={"Створити куратора"} /></div>
                </form>

            </> : <></>}
            <div className="curator_list"> {response.length === 0 ?
                <>
                    Немає кураторів
                </> :
                <>
                    {response.map((ele, index) => (
                        <div>
                            <div><strong>{ele.email}</strong>   {"  " + ele.rooms[0] + "-" + ele.rooms[ele.rooms.length - 1]}</div>
                        </div>
                    ))}
                </>}
            </div>
            <div className="greeting">
                <strong><p>Вітаємо вдома!</p></strong>
                <Map />
            </div>
        </div>
    )
}

export default Curator_menager
