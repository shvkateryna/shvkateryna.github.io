import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContexts";
import { Link, useNavigate } from "react-router-dom"

export default function Signup() {
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
    const authRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { signInWithGoogle } = useAuth()


    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Паролі не збігаються')
        }

        try {
            setError('')
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            navigate("/")
        } catch {
            setError('Не вдалося створити профіль')
        }
        setLoading(false)
    }
    return (
        <div>
            <div className="header">
                <div className="logo">RooMy</div>
                <div className="button_group">
                    <button onClick={() => routeChange("/")} className="header_button-login">Головна</button>
                </div>
            </div>
            <div className="image">
                {/* <img src={logo}></img> */}
            </div>
            <Container className='align-items-center justify-content-center' style={{ justifyContent: "center", minHeight: '100vh', maxWidth: '400px', marginTop: "80px" }}>
                <Card>
                    <Card.Body style={{ backgroundColor: "#FAECE1" }}>
                        <h2 className='text-center mb-4' style={{ color: "#542400", fontFamily: "unset" }}>Зареєструвати</h2>
                        {error && <Alert variant='danger'>{error}</Alert>}
                        <Form style={{ height: "450px" }} onSubmit={handleSubmit}>
                            <Form.Group id='name'>
                                <Form.Label style={{ color: "#542400", fontFamily: "Forum" }}>Ім'я та прізвище</Form.Label>
                                <Form.Control type='text' ref={authRef} required></Form.Control>
                            </Form.Group>
                            <Form.Group id='email'>
                                <Form.Label style={{ color: "#542400", fontFamily: "Forum" }}>Корпоративна пошта</Form.Label>
                                <Form.Control type='email' ref={emailRef} required></Form.Control>
                            </Form.Group>
                            <Form.Group id='password'>
                                <Form.Label style={{ color: "#542400", fontFamily: "Forum" }}>Пароль</Form.Label>
                                <Form.Control type='password' ref={passwordRef} required></Form.Control>
                            </Form.Group>
                            <Form.Group id='password-confirm'>
                                <Form.Label style={{ color: "#542400", fontFamily: "Forum" }}>Підтвердження паролю</Form.Label>
                                <Form.Control type='password' ref={passwordConfirmRef} required></Form.Control>
                            </Form.Group>
                            <div>
                                <Button disabled={loading} className='w-100' type='submit'
                                    style={{ backgroundColor: "#542400", border: "#542400", marginTop: "35px", height: "65px", fontFamily: "Forum", fontSize: "20px", backgroundColor: isHover ? '#896347' : 'rgb(84, 36, 0)', color: isHover ? 'white' : 'white', padding: '15px', marginTop: "20px" }}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}>
                                    <p>Зареєструвати</p>
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
                <div className='w-100 text-center mt-2' style={{ color: "#542400", fontFamily: "Forum" }}>
                    Зареєстрований? <Link style={{ color: "#542400", fontFamily: "Forum" }} to="/login">Увійти</Link>
                </div>
            </Container>
        </div>
    )
}