import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContexts";
import { Link, useNavigate } from "react-router-dom"
import NavBar from "./NavBar";

export default function ForgotPassword() {
    let navigate1 = useNavigate();
    const routeChange = (path) => {
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
    const { resetPassword } = useAuth()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Заглянь на пошту за подальшими інструкціями')
        } catch {
            setError('Не вдалосяя відновити пароль')
        }
        setLoading(false)
    }

    return (
        <div>
            <NavBar />
            <div className="image">
                {/* <img src={logo}></img> */}
            </div>
            <Container className='align-items-center justify-content-center' style={{ justifyContent: "center", minHeight: '100vh', maxWidth: '400px', marginTop: "80px" }}>
                <Card>
                    <Card.Body style={{ backgroundColor: "#FAECE1" }}>
                        <h2 className='text-center mb-4' style={{ color: "#542400", fontFamily: "unset" }}>Скинути пароль</h2>
                        {error && <Alert variant='danger'>{error}</Alert>}
                        {message && <Alert variant='success'>{message}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id='email'>
                                <Form.Label style={{ color: "#542400", fontFamily: "Forum" }}>Корпоративна пошта</Form.Label>
                                <Form.Control type='email' ref={emailRef} required></Form.Control>
                            </Form.Group>
                            <Button disabled={loading} className='w-100' type='submit' style={{ backgroundColor: "#542400", border: "#542400", marginTop: "35px", height: "65px", fontFamily: "Forum", fontSize: "20px", backgroundColor: isHover ? '#896347' : 'rgb(84, 36, 0)', color: isHover ? 'white' : 'white', padding: '15px' }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}>
                                Скинути пароль
                            </Button>
                        </Form>
                        <div className='w-100 text-center mt-3'>
                            <Link to="/login" style={{ color: "#542400", fontFamily: "Forum" }}>Увійти</Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}
