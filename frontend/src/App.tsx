import { lazy } from 'react';
import {Routes, Route } from 'react-router-dom';
import PrivateRoute from '@src/components/auth/PrivateRoute';
import OpenRoute from '@src/components/auth/OpenRoute';

const Home = lazy(() => import("@src/pages/Home"))
const Dashboard = lazy(() => import("@src/pages/Dashboard"))
const About = lazy(() => import("@src/pages/About"))
const Login = lazy(() => import("@src/pages/Login"))
const Chat = lazy(() => import("@src/pages/Chat"))
const Groups = lazy(() => import("@src/pages/Groups"))

function App() {
  return (
    <div className='appScreen'>
      <Routes>

        {/* open routes */}
        <Route element = {<OpenRoute/>}>
          <Route path='/' element= {<Home/>}/>
          <Route path='/login' element= {<Login/>}/>
        </Route>

        {/* private routes */}
        <Route path='/dashboard' element= {<PrivateRoute><Dashboard/></PrivateRoute>}/>
        <Route path='/about' element= {<PrivateRoute><About/></PrivateRoute>}/>
        <Route path='/chat/:chatId' element= {<PrivateRoute><Chat/></PrivateRoute>}/>
        <Route path='/groups' element= {<PrivateRoute><Groups/></PrivateRoute>}/>

      </Routes>
    </div>
  );
}

export default App;