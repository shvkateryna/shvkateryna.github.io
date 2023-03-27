import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import Signup from './Signup';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from "./Dashboard"
import Login from "./Login"
import ForgotPassword from './ForgotPassword'
import UpdateProfile from './UpdateProfile';
import Main from './Main'
import Main_Page from './Main';
import Main_Form from "./Main_Form"
import About from "./About"
import Rules from "./Rules"
import { useAuth } from "../contexts/AuthContexts"
import Rooms from './Rooms';
import Curator_menager from './Curator_menager';
// class App extends Component {
//   state = {
//     selectedFile: null
//   }

//   fileSelectedHandler = event => {
//     this.setState({
//       selectedFile: event.target.files[0]
//     })
//   }

//   fileUploadHandler = () => {
//     const fd = new FormData()
//     fd.append('image', this.state.selectedFile, this.state.selectedFile.name)
//     axios.post('gs://rommy-d53cb.appspot.com', fd)
//     .then( res =>  {
//       console.log(res)
//     });
//   }
//   render() {
//     return (
//       <div className = 'App'>
//         <input type = 'file' onChange = {this.fileSelectedHandler}></input>
//         <button onClick={this.fileUploadHandler}>Прикріпити фото</button>
//       </div>
//     )
//   }
// }

function App() {
  const { currentUser, role } = useAuth()
  console.log(role)
  return (
    <div>
      <div className='w-100 h-100 outer'>
        <Routes>
          {currentUser ? <>
            {/* {role === "ADMIN" ? <> */}
            <Route exact path="/manager" element={<Curator_menager />} />
            {/* </> : <></>} */}
            <Route exact path="/rooms_curator" element={<Rooms user_id={currentUser._delegate.uid} />} />
          </> :
            <></>}
          <Route exact path="/manager" element={<Curator_menager />} />
          <Route exact path="/" element={<Main />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Main_Page />} />
          <Route path="/about" element={<About />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/rooms/:id_coded" element={<Main_Form />} />
        </Routes>
      </div>
    </div>
  )
}

export default App;
