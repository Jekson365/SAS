import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './screens/auth/Login'
import Register from './screens/auth/Register'
import VerifyEmail from './screens/auth/VerifyEmail'
import Home from './screens/home/Home'
import OngoingTest from './screens/ongoingTest/OngoingTest'
import CreateTest from './screens/createTest/CreateTest'
import EditTest from './screens/editTest/EditTest'
import './styles/App.scss'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/home" element={<Home />} />
        <Route path="/test/:id" element={<OngoingTest />} />
        <Route path="/create-test" element={<CreateTest />} />
        <Route path="/edit-test/:id" element={<EditTest />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App