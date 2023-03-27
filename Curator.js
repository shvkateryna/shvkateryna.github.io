import "../styles/Curator.css"
import React from "react"
import { useNavigate } from "react-router-dom";

function Curator() {

    let navigate = useNavigate(); 
    const routeChange = (path) =>{ 
      navigate(path);
    }

  return (
    <div className="main"
      style = {{ minHeight: '100vh' }}>
      <div className="header">
        <div className="logo">RooMy</div>
        <div className="button_group">
            <button onClick={()=>routeChange("/")} className="header_button-home">Головна</button>
        </div>
      </div>
      <div className="main-text">
          <strong>Список кімнат</strong>
      </div>
      <div className="rooms">
        <div onClick={()=>routeChange("419")} className="header_button-room">Кімната №419</div>
        <div onClick={()=>routeChange("420")} className="header_button-room">Кімната №420</div>
        <div onClick={()=>routeChange("421")} className="header_button-room">Кімната №421</div>
        <div onClick={()=>routeChange("422")} className="header_button-room">Кімната №422</div>
        <div onClick={()=>routeChange("423")} className="header_button-room">Кімната №423</div>
        <div onClick={()=>routeChange("424")} className="header_button-room">Кімната №424</div>
        <div onClick={()=>routeChange("425")} className="header_button-room">Кімната №425</div>
        <div onClick={()=>routeChange("426")} className="header_button-room">Кімната №426</div>
        <div onClick={()=>routeChange("427")} className="header_button-room">Кімната №427</div>
        <div onClick={()=>routeChange("428")} className="header_button-room">Кімната №428</div>
        <div onClick={()=>routeChange("429")} className="header_button-room">Кімната №429</div>
        <div onClick={()=>routeChange("430")} className="header_button-room">Кімната №430</div>
        <div onClick={()=>routeChange("431")} className="header_button-room">Кімната №431</div>
        <div onClick={()=>routeChange("432")} className="header_button-room">Кімната №432</div>
        <div onClick={()=>routeChange("433")} className="header_button-room">Кімната №433</div>
        <div onClick={()=>routeChange("434")} className="header_button-room">Кімната №434</div>
      </div>
    </div>
  );
}

export default Curator;
