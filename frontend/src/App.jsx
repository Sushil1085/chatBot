import { Box, Button, Flex } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import SideBar from "./components/SideBar"
import MainPage from './components/MainPage'
import Layout from './Layout';
import UserLogin from './components/UserLogin';
import SignUp from './components/SignUp';



function App() {

  


  return (
    <>
    
        <Router>
      <Routes>
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Layout  />}>
          <Route path="/" element={<MainPage />} /> 
          <Route path="/:id" element={<MainPage />} />
          {/* <Route path="/login" element={<UserLogin />} /> */}
        </Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
