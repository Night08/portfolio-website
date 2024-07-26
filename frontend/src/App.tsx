import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
    <div>
          <Navbar  />
          <div className="min-h-screen">
            <Outlet />
          </div>
          {/* <Footer /> */}
        </div>
      <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
    <button className="btn">Button</button>
    </>
  )
}

export default App
