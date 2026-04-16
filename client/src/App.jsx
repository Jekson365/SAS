import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './screens/auth/Login'
import Register from './screens/auth/Register'
import Home from './screens/home/Home'
import OngoingTest from './screens/ongoingTest/OngoingTest'
import CreateTest from './screens/createTest/CreateTest'
import './styles/App.scss'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/test/:id" element={<OngoingTest />} />
        <Route path="/create-test" element={<CreateTest />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
