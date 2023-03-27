import { auth } from "../firebase";
import React, { useContext, useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useNavigate } from "react-router-dom"
import axios from "axios";

const AuthContext = React.createContext()
export function useAuth() {
    return useContext(AuthContext)
}
export function AuthProvider({ children }) {
    let navigate1 = useNavigate();
    const [currentUser, setCurrentUser] = useState(Object)
    const [role, setRole] = useState("")
    const [loading, setLoading] = useState(true)
    const signInWithGoogle = () => {
        signInWithPopup(auth, new GoogleAuthProvider()).then((result) => {
            console.log(result)
            navigate1("/")
        })
            .catch((error) => {
                console.log(error);
            })
    }
    function signup(email, password, role,rooms) {
        return  auth.createUserWithEmailAndPassword(email, password).then((result) => {
            console.log(result)
            axios.post(`http://localhost:5000/create_user`, {
                email: email,
                role: role,
                uid:result.user._delegate.uid,
                rooms:rooms
            })
        })
            .catch((error) => {
                console.log(error);
            })
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout() {
        return auth.signOut()
    }
    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email)
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            if (user) {
                axios.post('http://localhost:5000/login', {
                    uid: user._delegate.uid
                })
                    .then(function (response) {
                        console.log(response)
                        console.log("asdasdasd")
                        setRole(response.data)
                    })
                    .catch(function (error) {
                        console.log(error.data);
                    });
            }
            setLoading(false)
        })
        return unsubscribe
    }, [])
    const value = {
        currentUser, role,
        signup,
        login,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        signInWithGoogle
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
