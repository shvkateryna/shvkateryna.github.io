import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import "../styles/Main_form.css"
import axios from 'axios';
import Form_reg from './Form_reg';
import { MapComponent } from './Map.js';
function Main_Form() {
    const { id_coded } = useParams();
    const [loading, setLoading] = useState(true)
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        axios.get(`http://localhost:5000/room/${id_coded}`)
            .then(res => {
                setResponse(res.data)
                setLoading(false)
                console.log(res.data)
                console.log("asdasdasd")
            }).catch(err => {
                setError(err)
                console.log(err)
                setLoading(false)
            }
            )
    }, []);
    return (
        <div className='main_form'>
            {loading ? <div class="loader_block"><div class="loader"></div><p>Зачекайте</p></div> :
                <>
                    {(response) ? <>
                        <div className='reg_text_div' >Реєстрація кімнати {response.name}</div>

                        <div className='reg_text_div' >Ви реєструєте кімнату №{response.number}</div>

                        <Form_reg room={response} id_coded={id_coded} />
                        <div className="greeting">
                            <strong><p>Вітаємо вдома!</p></strong>
                            <MapComponent />
                        </div>
                    </> : <></>}
                    {error ? <>
                        {error.response.data === "Wrong code" ? <div className='notions'>
                            Ваш код не правильний
                        </div> : <div className='notions'>
                            Ваша форма вже підтвердженна куратором ви не можете робити змінни
                        </div>}
                    </> : <></>}
                </>}

        </div>
    )
}
export default Main_Form
