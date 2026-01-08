import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './components/Signup'
import Signin from './components/Signin'
import Dashboard from './components/Dashboard'
import SendMoney from './components/SendMoney'
import Profile from './components/Profile'
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Toaster richColors position="top-center" />
      </BrowserRouter>
    </>
  )
}
export default App
