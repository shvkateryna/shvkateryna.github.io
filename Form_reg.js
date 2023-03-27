import "../styles/Form_reg.css"
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
} from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";
import { async } from "@firebase/util";
function Form_reg(props) {
    const id_coded = props.id_coded
    const [room, setRoom] = useState(props.room);
    const [ruleAccepted, setRuleAccepted] = useState(false);
    const [step, setStep] = useState(1)
    const [stepfur, setStepfur] = useState(0)
    const [error, setError] = useState("")
    const [errorFurniture, setErrorFurniture] = useState("")
    const [available, setAvailable] = useState([])
    const [sendingForm, setSendingForm] = useState(false)
    let navigate = useNavigate();
    const routeChange = (path) => {
        navigate(path);
    }
    
    window.addEventListener('beforeunload', function (e) {
        e.preventDefault();
        setStep(1)
        e.returnValue = '';
    });
    console.log(room)
    function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    async function uploadFile(file, categorie) {
        return new Promise(function (resolve, reject) {
            const imageRef = ref(storage, `images/${categorie}/${uuidv4()}`);
            uploadBytes(imageRef, file).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    resolve(url)
                }).catch((error) => { reject(error) });
            });
        });
    };
    const handleChangeUser = (index, value) => {
        let users = room.names
        users[index] = value
        console.log(users)
        setRoom((prev) => ({ ...prev, "names": users }))
    }
    const handleChangeRoom = (index_block, index, option, value) => {
        let obj = room.furniture_list[index_block]
        obj[index][option] = value
        let new_list = room.furniture_list
        new_list[index_block] = obj
        setRoom((prev) => ({ ...prev, "furniture_list": new_list }))

    }
    function checkUsers_inp(e) {
        e.preventDefault()
        for (const [index, user_name] of room.names.entries()) {
            if (user_name === "") {
                let index_pr = index + 1
                setError("Введіть ім'я " + index_pr + " мешканця.")
                return;
            } else {
                if (user_name.length < 5) {
                    let index_pr = index + 1
                    setError("Введіть ім'я та прізвище " + index_pr + " мешканця.")
                    return;
                }
            }
        }
        setAvailable(room.names)
        setStep(prev => prev + 1)
    }
    function checkFurniture_inp() {
        let owners = []
        for (let elem of room.furniture_list[stepfur]) {
            if (elem.description === null | elem.description === "") {
                setErrorFurniture("Немає опису об'єкту '" + elem.type_expanded + "'.")
                return (false)
            }
            if (elem.type === "bed" & elem.owner === null) {
                setErrorFurniture("Немає власника об'єкту '" + elem.type_expanded + "'.")
                return (false)
            }
            if (elem.type === "bed" & owners.includes(elem.owner)) {
                setErrorFurniture("Об'єкт " + elem.type_expanded + " має вже використаного власника.")
                return (false)
            }
            console.log(owners)
            if (elem.type === "bed") {
                owners.push(elem.owner)
            }

        }
        return (true)
    }
    const handle_post = async (e) => {
        e.preventDefault();
        setSendingForm(true)
        console.log(sendingForm)
        let new_furniture_list = []
        console.log(room.furniture_list)
        for (let furnit_list of room.furniture_list) {
            for (let furnit of furnit_list) {
                if (furnit.images !== null) {
                    console.log("grea")
                    const res = await uploadFile(furnit.images, room.number);
                    furnit.images = res
                    new_furniture_list.push(furnit)
                } else {
                    new_furniture_list.push(furnit)
                }
            }
        }
        setRoom((prev) => ({ ...prev, "furniture_list": new_furniture_list }))
        axios.post(`http://127.0.0.1:5000/room/${id_coded}/submit`, room)
            .then(res => {
                console.log(res.data)
                routeChange("/")
            }).catch(err =>
                console.log(err))
    }
    return (

        <div className="main_div" key={"main_form_div"}>
            {sendingForm ? <>
            <div className="loading_card">
            Зачекайте ми обробляємо вашу відповідь...
            </div>
            </> : <>
                <form className="main_form" key="submit_form" >
                    {(() => {
                        switch (step) {
                            case 1:
                                return (<div key="users_div" className="user_div">
                                    {error ? <div key={"error_message"} className="error_block">
                                        {error}
                                    </div> : <></>}
                                    {room.names.map((ele, index) => (
                                        <div key={"user_div" + index} className="user_div_inner">
                                            <label className="user_label" key={"user_" + index}>
                                                Ім'я {index + 1} мешканця
                                            </label>
                                            <input placeholder="Введіть ім'я" className="user_input" type="text" key={"inp_user" + index} onChange={(e) => handleChangeUser(index, e.target.value)} value={room.names[index]} />
                                        </div>
                                    ))}

                                    <button className="button_next" key="button_users" onClick={(e) => checkUsers_inp(e)}>Далі</button>
                                </div>)

                            case 2:
                                return (<>

                                    {room.furniture_list.map((block, index_block) => (
                                        <>
                                            {(() => {
                                                switch (stepfur) {
                                                    case index_block:
                                                        return (<>
                                                            <div className='furniture_list' key="furniture_div">
                                                                <strong key="strong_main"><p key={"main_p"} className="step_2">Крок {stepfur + 2}</p></strong>
                                                                {errorFurniture ? <>
                                                                    <div className="error_block">{errorFurniture}</div>
                                                                </> : <></>}
                                                                {block.map((ele, index) => (<>
                                                                    <div key={"div_" + index + "" + index_block} className='furniture_block'>
                                                                        <div key={"div_header_" + index + "" + index_block} className="header_furniture">
                                                                            <div key={"que_body_" + index + "" + index_block} className="text_header">
                                                                                <strong key={"strong_" + index + "" + index_block}>{index + 1 + ")    "} {ele.type_expanded}<br /></strong>
                                                                            </div>
                                                                            {ele.questions}
                                                                        </div>
                                                                        <div key={"div_body_" + index + "" + index_block} className="body_furniture">
                                                                            {ele.type === "bed" ? <div key={"div_select_" + index + "" + index_block}><select key={"_select_" + index + "" + index_block} className="select_owner"
                                                                                onChange={(e) => handleChangeRoom(index_block, index, "owner", e.target.value)}>
                                                                                <option disabled selected value> -- виберіть власника -- </option>
                                                                                {available.map((elem, index_user) => (
                                                                                    <option key={"opt_" + index + "_" + index_user + "" + index_block} value={elem}>{elem}</option>
                                                                                ))}
                                                                            </select></div> : <></>}

                                                                            <div key={"text_image" + index + "" + index_block} className="obj_input">
                                                                                <textarea className="obj_description"
                                                                                    onChange={(e) => handleChangeRoom(index_block, index, "description", e.target.value)}
                                                                                    value={room.furniture_list[index_block][index].description}
                                                                                    key={"inp_" + index + "" + index_block} type="text"
                                                                                    placeholder={"Опишіть стан"} />
                                                                            </div>
                                                                            <div key={"div_image" + index + "" + index_block} className="file_div">
                                                                                <input
                                                                                    key={"input_image" + index + "" + index_block}
                                                                                    className="file_input"
                                                                                    type="file"
                                                                                    onChange={(event) => {
                                                                                        handleChangeRoom(index_block, index, "images", event.target.files[0])
                                                                                    }}>
                                                                                </input>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </>))}
                                                                <button className="button_next" key="button_room" onClick={(e) => {
                                                                    e.preventDefault()
                                                                    if (checkFurniture_inp()) {
                                                                        setErrorFurniture("")
                                                                        if (stepfur + 1 >= room.furniture_list.length) {
                                                                            setStep((prev) => prev + 1)
                                                                        } else {
                                                                            setStepfur((prev) => prev + 1)
                                                                        }

                                                                    }
                                                                    window.scrollTo(0, 0);
                                                                }}>Далі</button>
                                                            </div>
                                                        </>)
                                                }
                                            })()}
                                        </>
                                    ))}
                                </>)
                            case 3:
                                return (<div key="rules_div">
                                    <label className="rules">Я погоджуюсь з правилами колегіуму</label>
                                    <input className="square"
                                        key="check_rules"
                                        type="checkbox"
                                        checked={ruleAccepted}
                                        onChange={(e) => setRuleAccepted(e.target.value)}
                                        value="Some rules"
                                    />
                                    <input disabled={!ruleAccepted} className="submit_form" value="Відправити" onClick={handle_post} key="submit_button" type={"submit"} />
                                </div>)
                            default:
                                return null
                        }
                    })()}
                </form>
            </>}
        </div>
    );
}
export default Form_reg 
