import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContexts";
import { Link, useNavigate } from "react-router-dom";
import  { MapComponent } from './Map.js';
import NavBar from "./NavBar";

export default function Login() {
    const { role } = useAuth()
    let navigate1 = useNavigate(); 
    const routeChange = (path) =>{ 
      navigate1(path);
    }
    const [isHover, setIsHover] = useState(false)
    const handleMouseEnter = () => {
        setIsHover(true);
    };
  
    const handleMouseLeave = () => {
        setIsHover(false);
    };
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            console.log(role)
            console.log("kmsndfjksndfkjsdfshdfjsdbfhbfhsbf")
            navigate("/")
            
        } catch {
            setError('Не вдалося увійти')
        }
        setLoading(false)
    }

    return(
        <div>
            <NavBar/>
            <div className="image">
                {/* <img src={logo}></img> */}
            </div>
        <Container className='align-items-center justify-content-center' style = {{justifyContent: "center",  minHeight: '60vh', maxWidth: '400px', marginTop:"80px"}}>
        <Card>
            <Card.Body style={{backgroundColor: "#FAECE1"}}>
                <h2 className = 'text-center mb-4' style={{color: "#542400", fontFamily: "unset"}}><strong>Увійти</strong></h2>
                {error && <Alert variant = 'danger'>{error}</Alert>}
                <Form onSubmit={handleSubmit} style={{height: "230px"}}>
                    <Form.Group id = 'email'>
                        <Form.Label style={{color: "#542400", fontFamily: "Forum"}}>Корпоративна пошта</Form.Label>
                        <Form.Control type = 'email' ref = {emailRef} required></Form.Control>
                    </Form.Group>
                    <Form.Group id = 'password'>
                        <Form.Label style={{color: "#542400", fontFamily: "Forum"}}>Пароль</Form.Label>
                        <Form.Control type = 'password' ref = {passwordRef} required></Form.Control>
                    </Form.Group>
                    <Button disabled = {loading} className = 'w-100' type = 'submit' style={{backgroundColor: "#542400", border: "#542400", marginTop: "15px", height: "65px", fontFamily: "Forum", fontSize: "20px", backgroundColor: isHover ? '#896347' : 'rgb(84, 36, 0)', color: isHover ? 'white' : 'white', padding: '15px'}}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
                        Увійти
                    </Button>
                </Form>
            </Card.Body>
        </Card>
        <div className = 'w-100 text-center mt-3'>
            <Link style={{color: "#542400", fontFamily: "Forum", marginTop: "40px"}} to="/forgot-password">Забув пароль?</Link>
        </div>
        </Container>
        <div className="greeting">
            <strong><p>Вітаємо вдома!</p></strong>
            <MapComponent />
        </div>
        </div>
    )
}
