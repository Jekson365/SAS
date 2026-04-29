import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './screens/landing/Landing'
import Login from './screens/auth/Login'
import Register from './screens/auth/Register'
import VerifyEmail from './screens/auth/VerifyEmail'
import Home from './screens/home/Home'
import OngoingTest from './screens/ongoingTest/OngoingTest'
import CreateTest from './screens/createTest/CreateTest'
import EditTest from './screens/editTest/EditTest'
import CreateEvent from './screens/createEvent/CreateEvent'
import './styles/App.scss'
import { TestResult } from './screens/testResults/TestResult'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/home" element={<Home />} />
        <Route path="/test/:id" element={<OngoingTest />} />
        <Route path="/create-test" element={<CreateTest />} />
        <Route path="/test-results" element={<TestResult />} />
        <Route path="/edit-test/:id" element={<EditTest />} />
        <Route path="/create-event" element={<CreateEvent />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App