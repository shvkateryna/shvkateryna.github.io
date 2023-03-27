import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../styles/Curator.css"
import { useAuth } from "../contexts/AuthContexts"
import NavBar from './NavBar';
const Rooms = (props) => {
  const refresh = () => window.location.reload(true)
  const { role } = useAuth()
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState([])
  const [currentRoom, setCurrentRoom] = useState(null)

  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  }
  const verify = (e, room_number, user_id) => {
    e.preventDefault()
    let new_rooms = []
    for (let room of response) {
      console.log("Cycle")
      let new_room = room
      if (room.number === room_number) {
        new_room.verified = true
      }
      new_rooms.push(new_room)
    }
    setResponse(new_rooms)
    axios.post('http://localhost:5000/verify', { room_n: room_number, u_id: user_id })
  }
  useEffect(() => {
    setLoading(true)
    axios.get(`http://localhost:5000/curator_rooms/${props.user_id}`)
      .then(res => {
        console.log(res)
        setResponse(res.data)
        setLoading(false)
      }).catch(err =>
        setLoading(false))
  }, []);
  return (
    <div className="main"
      style={{ minHeight: '100vh' }}>
      {currentRoom === null ? <>
        {loading ? <>
          <text styles={{}}><span class="loader"></span></text>

        </> : <>
          <NavBar/>
          <div className="main-text">
            <strong>Список кімнат</strong>
          </div>
          <div className="rooms">
            {response.map((ele, index) => (
              <div className="header_button-room" onClick={() => setCurrentRoom(ele)}>{ele.number}{ele.verified ? "✔️" : "❌"}</div>
            ))}
          </div></>}
      </> : <>
        <div className='main_form'>
          <div className='info'><strong>Інформація про кімнату {currentRoom.number}</strong></div>
          <div className='name'>
            <strong>Ім'я мешканців:</strong>
            {currentRoom.names.map((name, index) => (
              <div key={name + index}>{name}</div>
            ))}
          </div>
          <div className='name'>
            {currentRoom.furniture_list.map((list_fur, index_fur) => (
              <>
                {list_fur.map((furniture, index) => (
                  <div key={"furniture_div" + index + index_fur}>
                    <div><strong>{furniture.type_expanded}</strong></div>
                    Опис:
                    <div>{furniture.description}</div>
                    {furniture.owner ? <>
                      <div>{furniture.owner + "owner"}</div>
                    </> : <></>}
                    <>{furniture.images !== null ? <img className='image' src={furniture.images} /> : <label>Немає інформації</label>}</>
                  </div>
                ))}
              </>
            ))}

          </div>
          <div className='verify'>
            <button disabled={currentRoom.verified} className='verify_button' onClick={(e) => verify(e, currentRoom.number, currentUser._delegate.uid)}>Підтвердити</button>
            <button className='verify_button' onClick={() => setCurrentRoom(null)}>Назад</button>
          </div>
        </div>
      </>}

    </div>
  )
}

export default Rooms