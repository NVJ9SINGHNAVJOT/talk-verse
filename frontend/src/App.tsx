import { lazy } from 'react';
import {Routes, Route } from 'react-router-dom';
import PrivateRoute from '@src/components/auth/PrivateRoute';
import OpenRoute from '@src/components/auth/OpenRoute';
import Navbar from '@src/components/common/Navbar';
import "@src/App.css"

const Home = lazy(() => import("@src/pages/Home"))
const Dashboard = lazy(() => import("@src/pages/Dashboard"))
const About = lazy(() => import("@src/pages/About"))
const Login = lazy(() => import("@src/pages/Login"))
const Chat = lazy(() => import("@src/pages/Chat"))
const Groups = lazy(() => import("@src/pages/Group"))
const Error = lazy(() => import("@src/pages/Error"))

function App() {
  return (
    <div className='w-screen h-screen overflow-y-auto'>
      <Navbar/>

      {/* all pages will be rendered below navbar */}
      <div className='w-full h-[calc(100vh-4rem)]'>
        <Routes>

          <Route path='/about' element= {<About/>}/>
          <Route path='/' element= {<Home/>}/>

          {/* open routes */}
          <Route element = {<OpenRoute/>}>
            <Route path='/login' element= {<Login/>}/>
          </Route>
          
          {/* private routes */}
          <Route element= {<PrivateRoute><Dashboard/></PrivateRoute>}>
            <Route path='/dashboard/chat/:chatId' element= {<Chat/>}/>
            <Route path='/dashboard/group/:grouId' element= {<Groups/>}/>
          </Route>
          
          {/* error route */}
          <Route path='*' element= {<Error/>}/>

        </Routes>
      </div>
      
    </div>
  );
}

export default App;