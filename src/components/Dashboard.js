import React, { useState } from 'react'
import { Card, Button, Alert, Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContexts'
import { Link, useNavigate } from 'react-router-dom'

export default function Dashboard() {
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
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()

    async function handleLogOut() {
        setError('')

        try {
          await logout()
          navigate('/login')
        } catch {
            setError('Не вдалося вийти')
        }
    }
    return (
        <div>
            <div className="header">
                <div className="logo">RooMy</div>
                <div className="button_group">
                    <button onClick={()=>routeChange("/")} className="header_button-login">Головна</button>
                </div>
            </div>
            <div className="image">
                {/* <img src={logo}></img> */}
            </div>
        <Container className='align-items-center justify-content-center' style = {{justifyContent: "center",  minHeight: '100vh', maxWidth: '400px', marginTop:"150px"}}>
        <Card>
            <Card.Body style={{color: "#542400", fontFamily: "unset", backgroundColor: "#FAECE1", textAlign: "center"}}>
                <h2 className = 'text-center mb-4' style={{color: "#542400", fontFamily: "unset"}}><strong>Профіль</strong></h2>
                {error && <Alert variant = 'danger'>{error}</Alert>}
                Корпоративна пошта: {currentUser.email}
                <Link to="/update-profile" className="btn btn-primary w-100 mt-3" style={{backgroundColor: "#542400", border: "#542400", marginTop: "10px", height: "46px", fontFamily: "Forum", fontSize: "18px", padding: "8px",  backgroundColor: isHover ? '#896347' : 'rgb(84, 36, 0)', color: isHover ? 'white' : 'white', padding: '10px'}}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                    Редагувати профіль
                </Link>
            </Card.Body>
        </Card>
        <div className = 'w-100 text-center mt-2'>
            <Link to="/login" onClick={handleLogOut} style={{color: "#542400", fontFamily: "Forum"}}>Вийти</Link>
        </div>
        </Container>
        </div>
    )
}
