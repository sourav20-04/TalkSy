import { Route, Routes, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage.jsx"
import { ToastContainer } from 'react-toastify';
import HomePage from "./pages/HomePage.jsx";
import { useContext } from "react";
import { AuthContext } from "./context/authContext.jsx";
import { ChatContext } from "./context/chatContext.jsx";


function App() {
  const {authUser}=useContext(AuthContext);
 

  

  return (
    <div className="font-sans" >
      <Routes>
       <Route path="/" element={ authUser ? <HomePage/>: <Navigate to='/login' replace /> } />
       <Route path="/login" element={!authUser ? <LoginPage/> :< Navigate to='/' replace/> } /> 
      </Routes>
      <ToastContainer/>
    </div>
    )
}

export default App
